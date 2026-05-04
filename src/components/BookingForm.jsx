// @ts-nocheck
import { useState, useEffect } from "react"
import emailjs from "@emailjs/browser"

const SERVICE_ID  = "service_ccvc1fv"
const TEMPLATE_ID = "template_1fnw2zf"
const PUBLIC_KEY  = "fZDcBL1R4yxjMRx8Y"

const BUDGET_OPTIONS = [
  "$5k – $10k",
  "$10k – $20k",
  "$20k – $30k",
  "$30k – $50k",
  "$50k – $75k",
  "$75k – $100k",
  "$100k+",
]

const EMPTY_FORM = {
  name: "",
  email: "",
  location: "",
  event_description: "",
  budget: "",
}

export default function BookingForm({ colors = {} }) {
  const [fields, setFields]     = useState(EMPTY_FORM)
  const [loading, setLoading]   = useState(false)
  const [status, setStatus]     = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 560)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const c = {
    cardBg:  colors._cardBg  || "#f9fafb",
    border:  colors.border   || "#e5e7eb",
    text:    colors.text     || "#0b0b0b",
    muted:   colors.muted    || "#6b7280",
    primary: colors.primary  || "#7C3AED",
  }

  const handleChange = (e) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (status) setStatus(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, fields, PUBLIC_KEY)
      setStatus({ type: "success", msg: "Your inquiry has been sent! We'll be in touch within 48 hours." })
      setFields(EMPTY_FORM)
    } catch (err) {
      console.error("EmailJS error:", err)
      setStatus({ type: "error", msg: "Something went wrong. Please try again or email us directly." })
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    background: "#ffffff",
    border: `1px solid ${c.border}`,
    borderRadius: 10,
    padding: isMobile ? "12px 14px" : "10px 14px",
    fontSize: isMobile ? 16 : 14, // 16px stops iOS from auto-zooming on focus
    color: c.text,
    fontFamily: "inherit",
    outline: "none",
    WebkitAppearance: "none",
  }

  const labelStyle = {
    display: "block",
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: c.muted,
    marginBottom: 6,
  }

  return (
    <>
      {/* Header */}
      <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: `1px solid ${c.border}` }}>
        <p style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: c.muted,
          margin: "0 0 6px",
        }}>
          Crash Adams
        </p>
        <h2 style={{ fontSize: isMobile ? 20 : 22, fontWeight: 700, margin: "0 0 4px", color: c.text }}>
          Booking Inquiry
        </h2>
        <p style={{ fontSize: 13, color: c.muted, margin: 0, lineHeight: 1.5 }}>
          Fill out the form below and we'll be in touch within 48 hours.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>

        {/* Name + Email — stacked on mobile, side by side on desktop */}
        <div style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? 12 : 16,
          marginBottom: isMobile ? 12 : 16,
        }}>
          <div>
            <label style={labelStyle} htmlFor="bk-name">Name</label>
            <input
              style={inputStyle}
              id="bk-name"
              type="text"
              name="name"
              placeholder="Your full name"
              value={fields.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>
          <div>
            <label style={labelStyle} htmlFor="bk-email">Email</label>
            <input
              style={inputStyle}
              id="bk-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={fields.email}
              onChange={handleChange}
              autoComplete="email"
              inputMode="email"
              required
            />
          </div>
        </div>

        {/* Location */}
        <div style={{ marginBottom: isMobile ? 12 : 16 }}>
          <label style={labelStyle} htmlFor="bk-location">Location</label>
          <input
            style={inputStyle}
            id="bk-location"
            type="text"
            name="location"
            placeholder="City, Country"
            value={fields.location}
            onChange={handleChange}
            autoComplete="country-name"
            required
          />
        </div>

        {/* Event Description */}
        <div style={{ marginBottom: isMobile ? 12 : 16 }}>
          <label style={labelStyle} htmlFor="bk-description">Event Description</label>
          <textarea
            style={{
              ...inputStyle,
              minHeight: isMobile ? 120 : 110,
              resize: "vertical",
              lineHeight: 1.6,
            }}
            id="bk-description"
            name="event_description"
            placeholder="Tell us about your event — type, date, audience size, and any special requests..."
            value={fields.event_description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Budget */}
        <div style={{ marginBottom: isMobile ? 20 : 24 }}>
          <label style={labelStyle} htmlFor="bk-budget">Budget Range</label>
          <div style={{ position: "relative" }}>
            <select
              style={{
                ...inputStyle,
                paddingRight: 36,
                cursor: "pointer",
                appearance: "none",
                WebkitAppearance: "none",
              }}
              id="bk-budget"
              name="budget"
              value={fields.budget}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select your budget</option>
              {BUDGET_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <svg
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
              width="12" height="8" viewBox="0 0 12 8" fill="none"
            >
              <path d="M1 1L6 7L11 1" stroke={c.muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: isMobile ? "15px 20px" : "13px 20px",
            background: loading ? c.muted : c.text,
            color: c.cardBg,
            border: "none",
            borderRadius: 10,
            fontSize: isMobile ? 14 : 13,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            transition: "opacity 0.15s",
            opacity: loading ? 0.6 : 1,
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {loading ? "Sending..." : "Send Inquiry"}
        </button>

        {/* Status message */}
        {status && (
          <div
            style={{
              marginTop: 12,
              padding: "10px 14px",
              borderRadius: 10,
              fontSize: 13,
              textAlign: "center",
              lineHeight: 1.5,
              background: status.type === "success" ? "#f0fdf4" : "#fef2f2",
              color: status.type === "success" ? "#15803d" : "#b91c1c",
              border: `1px solid ${status.type === "success" ? "#bbf7d0" : "#fecaca"}`,
            }}
          >
            {status.msg}
          </div>
        )}
      </form>
    </>
  )
}