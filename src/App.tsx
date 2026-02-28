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
    if (!iban || !/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(iban.toUpperCase())) {
      setQrUrl('')
      return
    }
    if (!amount || Number(amount) <= 0 || Number(amount) > 100000) {
      setQrUrl('')
      return
    }
    if (vs && !/^\d{1,10}$/.test(vs)) {
      setQrUrl('')
      return
    }
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
      <h1>QR kód generátor</h1>
      <div className="field">
        <label>IBAN</label>
        <input type="text" value={iban} onChange={(e) =>
         {
          const val = e.target.value.toUpperCase().slice(0, 34)
          const prefix = val.slice(0, 2).replace(/[^A-Z]/g, '')
          const rest = val.slice(2).replace(/[^A-Z0-9]/g, '')
          setIban(prefix + rest)
        }}/>
      </div>
      <div className="field">
        <label>Částka</label>
        <input type="text" value={amount} onChange={(e) =>
         {
          const val = e.target.value.replace(/[^\d.]/g, '').replace(/^(\d*\.?\d{0,2}).*$/, '$1')
          if (Number(val) <= 100000) setAmount(val)
         }}
         placeholder="povinná" />
      </div>
      <div className="field">
        <label>Zpráva</label>
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value.slice(0, 60))} placeholder="volitelná" />
      </div>
      <div className="field">
        <label>Variabilní symbol</label>
        <input type="text" value={vs} onChange={(e) => setVs(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="volitelný" />
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