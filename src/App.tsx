import { useState, useRef, useEffect } from 'react'
import QRCode from 'qrcode'

function App() {
  const [iban, setIban] = useState('CZ7862106701002229830159')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [vs, setVs] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const buildSpdString = (): string => {
    let spd = `SPD*1.0*ACC:${iban}*AM:${amount}*CC:CZK`
    if (vs) spd += `*X-VS:${vs}`
    if (message) spd += `*MSG:${message}`
    return spd
  }

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, buildSpdString())
    }
  }, [iban, amount, message, vs])

  return (
    <div className="container">
      <h1>QR code generator</h1>
      <div className="field field-iban">
  <label>IBAN</label>
  <input type="text" value={iban} onChange={(e) => setIban(e.target.value)} />
  </div>
      <div className="field field-amount">
        <label>Částka</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="povinná" />
      </div>
    <div className="field">
        <label>Zpráva</label>
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="volitelná" />
      </div>
      <div className="field">
        <label>Variabilní symbol</label>
        <input type="text" value={vs} onChange={(e) => setVs(e.target.value)} placeholder="volitelný" />
      </div>
      <div className="qr">
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}

export default App