// Web Audio sentez motoru — sample yok, midi yok.
// Gerçeklik iki şeyden gelir: prosedürel convolution reverb + formant/noise şekillendirme.

class AudioEngine {
  private ctx: AudioContext | null = null
  private master!: GainNode
  private reverb!: ConvolverNode
  private noiseBuf!: AudioBuffer

  ensure() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume()
      return
    }
    const ctx = new AudioContext()
    this.ctx = ctx

    const comp = ctx.createDynamicsCompressor()
    comp.threshold.value = -18
    comp.knee.value = 22
    comp.ratio.value = 4
    comp.connect(ctx.destination)
    this.master = ctx.createGain()
    this.master.gain.value = 0.85
    this.master.connect(comp)

    // orman reverb'i: üstel sönümlü stereo noise IR
    this.reverb = ctx.createConvolver()
    this.reverb.buffer = this.makeIR(2.9, 2.6)
    this.reverb.connect(this.master)

    this.noiseBuf = this.makeNoise(2)
    this.startAmbient()
  }

  private makeIR(seconds: number, decay: number): AudioBuffer {
    const ctx = this.ctx!
    const rate = ctx.sampleRate
    const len = Math.floor(rate * seconds)
    const buf = ctx.createBuffer(2, len, rate)
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch)
      for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay)
      }
    }
    return buf
  }

  private makeNoise(seconds: number): AudioBuffer {
    const ctx = this.ctx!
    const len = Math.floor(ctx.sampleRate * seconds)
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
    return buf
  }

  private noiseSrc(): AudioBufferSourceNode {
    const src = this.ctx!.createBufferSource()
    src.buffer = this.noiseBuf
    src.loop = true
    return src
  }

  // --- ambient: rüzgâr + cırcırlar ---

  private startAmbient() {
    const ctx = this.ctx!
    // alçak rüzgâr gövdesi
    this.windLayer(190, 'lowpass', 0.8, 0.1, 0.055, 0.05, 60)
    // yüksek esinti
    this.windLayer(620, 'bandpass', 1.1, 0.045, 0.035, 0.13, 220)
    // cırcırlar
    this.cricketVoice(-0.55, 4250)
    this.cricketVoice(0.5, 4600)
    // çok seyrek uzak baykuş
    const owl = () => {
      if (!this.ctx) return
      this.owlCall()
      setTimeout(owl, 25000 + Math.random() * 40000)
    }
    setTimeout(owl, 12000 + Math.random() * 20000)
    void ctx
  }

  private windLayer(
    freq: number, type: BiquadFilterType, q: number,
    gain: number, gustDepth: number, lfoFreq: number, freqWobble: number
  ) {
    const ctx = this.ctx!
    const src = this.noiseSrc()
    const f = ctx.createBiquadFilter()
    f.type = type
    f.frequency.value = freq
    f.Q.value = q
    const g = ctx.createGain()
    g.gain.value = gain
    src.connect(f)
    f.connect(g)
    g.connect(this.master)
    const wet = ctx.createGain()
    wet.gain.value = gain * 0.5
    f.connect(wet)
    wet.connect(this.reverb)
    // gust LFO
    const lfo = ctx.createOscillator()
    lfo.frequency.value = lfoFreq
    const lfoG = ctx.createGain()
    lfoG.gain.value = gustDepth
    lfo.connect(lfoG)
    lfoG.connect(g.gain)
    lfo.start()
    // filtre gezintisi
    const lfo2 = ctx.createOscillator()
    lfo2.frequency.value = lfoFreq * 0.63
    const lfo2G = ctx.createGain()
    lfo2G.gain.value = freqWobble
    lfo2.connect(lfo2G)
    lfo2G.connect(f.frequency)
    lfo2.start()
    src.start()
  }

  private cricketVoice(pan: number, baseF: number) {
    const ctx = this.ctx!
    const src = this.noiseSrc()
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = baseF
    bp.Q.value = 16
    const g = ctx.createGain()
    g.gain.value = 0
    const p = ctx.createStereoPanner()
    p.pan.value = pan
    src.connect(bp)
    bp.connect(g)
    g.connect(p)
    p.connect(this.master)
    src.start()
    const chirp = () => {
      if (!this.ctx) return
      const t = ctx.currentTime + 0.05
      const nPulse = 4 + Math.floor(Math.random() * 4)
      for (let i = 0; i < nPulse; i++) {
        const pt = t + i * 0.029
        g.gain.setValueAtTime(0, pt)
        g.gain.linearRampToValueAtTime(0.016, pt + 0.007)
        g.gain.linearRampToValueAtTime(0, pt + 0.025)
      }
      setTimeout(chirp, 500 + Math.random() * 2200)
    }
    setTimeout(chirp, Math.random() * 1500)
  }

  private owlCall() {
    const ctx = this.ctx!
    const t = ctx.currentTime
    for (const [dt, len] of [[0, 0.32], [0.45, 0.5]] as [number, number][]) {
      const o = ctx.createOscillator()
      o.type = 'sine'
      o.frequency.setValueAtTime(340, t + dt)
      o.frequency.exponentialRampToValueAtTime(295, t + dt + len)
      const g = ctx.createGain()
      g.gain.setValueAtTime(0, t + dt)
      g.gain.linearRampToValueAtTime(0.035, t + dt + 0.08)
      g.gain.exponentialRampToValueAtTime(0.001, t + dt + len)
      o.connect(g)
      g.connect(this.reverb) // tamamen ıslak: çok uzakta
      o.start(t + dt)
      o.stop(t + dt + len + 0.1)
    }
  }

  // --- havlama: formant sentezi ---

  bark() {
    if (!this.ctx) return
    const ctx = this.ctx
    const t = ctx.currentTime
    const f0 = 300 + Math.random() * 80

    // gırtlak: saw + distortion
    const o = ctx.createOscillator()
    o.type = 'sawtooth'
    o.frequency.setValueAtTime(f0, t)
    o.frequency.exponentialRampToValueAtTime(115, t + 0.16)
    const shaper = ctx.createWaveShaper()
    const curve = new Float32Array(256)
    for (let i = 0; i < 256; i++) {
      const x = (i / 128) - 1
      curve[i] = Math.tanh(x * 3.2)
    }
    shaper.curve = curve

    const f1 = ctx.createBiquadFilter()
    f1.type = 'bandpass'; f1.frequency.value = 650; f1.Q.value = 6
    const f2 = ctx.createBiquadFilter()
    f2.type = 'bandpass'; f2.frequency.value = 1250; f2.Q.value = 7
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'; lp.frequency.value = 900

    const env = ctx.createGain()
    env.gain.setValueAtTime(0, t)
    env.gain.linearRampToValueAtTime(0.7, t + 0.007)
    env.gain.exponentialRampToValueAtTime(0.001, t + 0.26)

    o.connect(shaper)
    for (const f of [f1, f2, lp]) { shaper.connect(f); f.connect(env) }
    env.connect(this.master)
    const wet = ctx.createGain()
    wet.gain.value = 0.4
    env.connect(wet)
    wet.connect(this.reverb)

    // göğüs sub'ı
    const sub = ctx.createOscillator()
    sub.type = 'square'
    sub.frequency.setValueAtTime(95, t)
    const subG = ctx.createGain()
    subG.gain.setValueAtTime(0, t)
    subG.gain.linearRampToValueAtTime(0.12, t + 0.01)
    subG.gain.exponentialRampToValueAtTime(0.001, t + 0.12)
    const subLp = ctx.createBiquadFilter()
    subLp.type = 'lowpass'; subLp.frequency.value = 200
    sub.connect(subLp); subLp.connect(subG); subG.connect(this.master)

    // nefes patlaması
    const n = this.noiseSrc()
    const hp = ctx.createBiquadFilter()
    hp.type = 'highpass'; hp.frequency.value = 1400
    const nG = ctx.createGain()
    nG.gain.setValueAtTime(0, t)
    nG.gain.linearRampToValueAtTime(0.18, t + 0.006)
    nG.gain.exponentialRampToValueAtTime(0.001, t + 0.09)
    n.connect(hp); hp.connect(nG); nG.connect(this.master)

    o.start(t); o.stop(t + 0.3)
    sub.start(t); sub.stop(t + 0.15)
    n.start(t); n.stop(t + 0.12)
  }

  // --- çan: müzik kutusu partial'ları ---

  private bell(freq: number, at: number, gain: number, decay: number, wet = 0.65) {
    const ctx = this.ctx!
    const partials: [number, number][] = [[1, 1], [3.01, 0.22], [4.92, 0.08]]
    const out = ctx.createGain()
    out.gain.value = 1
    out.connect(this.master)
    const wetG = ctx.createGain()
    wetG.gain.value = wet
    out.connect(wetG)
    wetG.connect(this.reverb)
    for (const [ratio, amp] of partials) {
      const o = ctx.createOscillator()
      o.type = 'sine'
      o.frequency.value = freq * ratio
      const g = ctx.createGain()
      g.gain.setValueAtTime(0, at)
      g.gain.linearRampToValueAtTime(gain * amp, at + 0.008)
      g.gain.exponentialRampToValueAtTime(0.0001, at + decay)
      o.connect(g)
      g.connect(out)
      o.start(at)
      o.stop(at + decay + 0.1)
    }
  }

  // --- anı tonu: pad + motif, fadeout ---

  memoryTone() {
    if (!this.ctx) return
    const ctx = this.ctx
    const t = ctx.currentTime
    // Am(add9) pad'i, detune çiftleri
    const lp = ctx.createBiquadFilter()
    lp.type = 'lowpass'
    lp.frequency.value = 1100
    const padOut = ctx.createGain()
    padOut.gain.value = 1
    lp.connect(padOut)
    padOut.connect(this.master)
    const wet = ctx.createGain()
    wet.gain.value = 0.7
    padOut.connect(wet)
    wet.connect(this.reverb)
    const freqs = [110, 220, 261.63, 329.63, 493.88]
    for (const f of freqs) {
      for (const det of [-2.5, 2.5]) {
        const o = ctx.createOscillator()
        o.type = f < 200 ? 'sine' : 'triangle'
        o.frequency.value = f
        o.detune.value = det
        const g = ctx.createGain()
        const peak = f < 200 ? 0.05 : 0.028
        g.gain.setValueAtTime(0, t)
        g.gain.linearRampToValueAtTime(peak, t + 1.8)
        g.gain.setValueAtTime(peak, t + 3.6)
        g.gain.exponentialRampToValueAtTime(0.0001, t + 7.8)
        o.connect(g)
        g.connect(lp)
        o.start(t)
        o.stop(t + 8)
      }
    }
    // müzik kutusu motifi: E5 → C5 → A4
    this.bell(659.25, t + 1.3, 0.06, 2.6)
    this.bell(523.25, t + 2.4, 0.055, 2.6)
    this.bell(440.0, t + 3.6, 0.05, 3.2)
  }

  // --- kazı ödülleri ---

  boneFind() {
    if (!this.ctx) return
    const ctx = this.ctx
    const t = ctx.currentTime
    // toprak thump'ı
    const o = ctx.createOscillator()
    o.type = 'sine'
    o.frequency.setValueAtTime(90, t)
    o.frequency.exponentialRampToValueAtTime(52, t + 0.13)
    const g = ctx.createGain()
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.5, t + 0.008)
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.22)
    o.connect(g)
    g.connect(this.master)
    o.start(t)
    o.stop(t + 0.25)
    // ahşap tık tık: yüksek Q bandpass rezonansı kendi kendine çınlar
    for (const [dt, f] of [[0.09, 780], [0.21, 615]] as [number, number][]) {
      const n = this.noiseSrc()
      const bp = ctx.createBiquadFilter()
      bp.type = 'bandpass'
      bp.frequency.value = f
      bp.Q.value = 18
      const ng = ctx.createGain()
      ng.gain.setValueAtTime(0, t + dt)
      ng.gain.linearRampToValueAtTime(0.55, t + dt + 0.004)
      ng.gain.exponentialRampToValueAtTime(0.001, t + dt + 0.11)
      n.connect(bp)
      bp.connect(ng)
      ng.connect(this.master)
      const wet = ctx.createGain()
      wet.gain.value = 0.25
      ng.connect(wet)
      wet.connect(this.reverb)
      n.start(t + dt)
      n.stop(t + dt + 0.15)
    }
  }

  shardFind() {
    if (!this.ctx) return
    const t = this.ctx.currentTime
    this.bell(880, t, 0.07, 2.2)
    this.bell(1318.5, t + 0.12, 0.03, 1.8)
  }
}

export const audio = new AudioEngine()
