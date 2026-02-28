import { useState, useEffect } from 'react'
import QRCode from 'qrcode'

function App() {
  const [iban, setIban] = useState('CZ7862106701002229830159')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [vs, setVs] = useState('')
  const [qrUrl, setQrUrl] = useState('')

  const buildSpdString = (): string => {
    let spd = `SPD*1.0*ACC:${iban}*AM:${amount}*CC:CZK`
    if (vs) spd += `*X-VS:${vs}`
    if (message) spd += `*MSG:${message}`
    return spd
  }

  useEffect(() => {
    QRCode.toDataURL(buildSpdString(), { width: 256 })
      .then((url) => setQrUrl(url))
  }, [iban, amount, message, vs])

  const shareQR = async () => {
    if (!qrUrl) return
    
    const blob = await (await fetch(qrUrl)).blob()
    const file = new File([blob], 'qr-platba.png', { type: 'image/png' })
    
    if (navigator.share) {
      await navigator.share({
        files: [file],
        title: 'QR Platba'
      })
    }
  }

  return (
    <div className="container">
      <h1>QR code generator</h1>
      <div className="field">
        <label>IBAN</label>
        <input type="text" value={iban} onChange={(e) => setIban(e.target.value)} />
      </div>
      <div className="field">
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
        {qrUrl && <img src={qrUrl} alt="QR platba" />}
      </div>
      <div className="share-qr">
        {qrUrl && <button onClick={shareQR}>Sdílet QR kód</button>}
      </div>
    </div>
  )
}

export default App