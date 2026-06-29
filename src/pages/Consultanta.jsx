import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Clock, Check, Send } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'
import { apiEndpoint } from '../lib/api'
import { t } from '../lib/i18n'
import './Consultanta.scss'

const serviceMeta = [
  { id: 'website', categoryId: 'website' },
  { id: 'ecommerce', categoryId: 'website' },
  { id: 'audit', categoryId: 'website' },
  { id: 'branding', categoryId: 'design' },
  { id: 'uiux', categoryId: 'design' },
  { id: 'software', categoryId: 'software' },
  { id: 'automation', categoryId: 'automation' },
  { id: 'strategy', categoryId: 'consulting' },
  { id: 'maintenance', categoryId: 'consulting' },
  { id: 'offer', categoryId: 'consulting' },
  { id: 'other', categoryId: 'other' },
]

const categoryIds = ['website', 'design', 'software', 'automation', 'consulting', 'other']

const availability = [
  {
    date: '2026-05-04',
    times: ['09:30', '11:00', '14:30', '16:00'],
  },
  {
    date: '2026-05-05',
    times: ['10:00', '12:00', '15:00'],
  },
  {
    date: '2026-05-06',
    times: ['09:00', '13:30', '17:00'],
  },
  {
    date: '2026-05-07',
    times: ['10:30', '12:30', '16:30'],
  },
]

const localesByLang = {
  ro: 'ro-RO',
  en: 'en-US',
  de: 'de-DE',
}

function getDateLabelFromIsoDate(isoDate, lang) {
  const date = new Date(`${isoDate}T00:00:00`)
  return new Intl.DateTimeFormat(localesByLang[lang] || localesByLang.ro, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(date)
}

function getMonthLabelFromIsoDate(isoDate, lang) {
  const date = new Date(`${isoDate}T00:00:00`)
  return new Intl.DateTimeFormat(localesByLang[lang] || localesByLang.ro, {
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function createCalendarDays(isoDate) {
  const refDate = new Date(`${isoDate}T00:00:00`)
  const year = refDate.getFullYear()
  const month = refDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const offset = (firstDay.getDay() + 6) % 7
  const days = []

  for (let i = 0; i < offset; i += 1) {
    days.push(null)
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    days.push(iso)
  }

  return days
}

export default function Consultanta() {
  const [searchParams] = useSearchParams()
  const submitButtonRef = useRef(null)
  const { lang } = useLanguage()

  const serviceTitles = t('consulting.service_titles', lang)
  const serviceCategories = t('consulting.service_categories', lang)
  const services = serviceMeta.map((service) => ({
    ...service,
    category: serviceCategories[service.categoryId] || service.categoryId,
    title: serviceTitles[service.id] || service.id,
    duration: t('consulting.duration_30', lang),
  }))
  const categories = [
    { id: 'all', label: t('consulting.category_all', lang) },
    ...categoryIds.map((id) => ({
      id,
      label: serviceCategories[id] || id,
    })),
  ]
  const weekDays = t('consulting.week_days', lang)

  const serviceFromUrl = searchParams.get('service')
  const normalizedServiceFromUrl = serviceFromUrl === 'altele' ? 'other' : serviceFromUrl
  const source = searchParams.get('source') || 'direct'
  const hasPresetService = services.some((service) => service.id === normalizedServiceFromUrl)

  const initialService = hasPresetService
    ? normalizedServiceFromUrl
    : services[0].id

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedService, setSelectedService] = useState(initialService)
  const [customService, setCustomService] = useState('')
  const [isCustomServiceConfirmed, setIsCustomServiceConfirmed] = useState(initialService !== 'other')
  const [selectedDate, setSelectedDate] = useState(availability[0].date)
  const [selectedTime, setSelectedTime] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [selectionUnlocked, setSelectionUnlocked] = useState(false)

  const isPresetLocked = hasPresetService && !selectionUnlocked

  const filteredServices = isPresetLocked
    ? services.filter((service) => service.id === selectedService)
    : selectedCategory === 'all'
      ? services
      : services.filter((service) => service.categoryId === selectedCategory)

  const selectedServiceData = services.find((service) => service.id === selectedService)
  const selectedDateData = availability.find((item) => item.date === selectedDate)
  const selectedDateLabel = selectedDate ? getDateLabelFromIsoDate(selectedDate, lang) : ''
  const hasSelectedService = Boolean(selectedServiceData)
  const isCalendarLocked = selectedService === 'other' && !isCustomServiceConfirmed
  const hasSelectedSlot = Boolean(selectedDate && selectedTime)
  const availabilityByDate = useMemo(
    () => Object.fromEntries(availability.map((item) => [item.date, item])),
    [],
  )
  const calendarDays = useMemo(() => createCalendarDays(availability[0].date), [])
  const monthLabel = useMemo(() => getMonthLabelFromIsoDate(availability[0].date, lang), [lang])

  useEffect(() => {
    if (hasSelectedSlot && submitButtonRef.current) {
      submitButtonRef.current.focus()
    }
  }, [hasSelectedSlot])

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitError('')
    setSubmitting(true)

    const formData = new FormData(event.currentTarget)

    const payload = {
      service: selectedServiceData,
      customService,
      date: selectedDate,
      time: selectedTime,
      source,
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      message: formData.get('message'),
    }

    try {
      const response = await fetch(apiEndpoint('/booking'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Booking submission failed.')
      }

      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setSubmitError(t('consulting.form_error', lang))
    } finally {
      setSubmitting(false)
    }
  }

  function handleCustomServiceSubmit(event) {
    event.preventDefault()
    const trimmedService = customService.trim()
    if (!trimmedService) return

    setCustomService(trimmedService)
    setIsCustomServiceConfirmed(true)

    window.setTimeout(() => {
      document
        .querySelector('.dr-booking-calendar')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 120)
  }

  return (
    <main className="dr-booking-page">
      <section className="dr-booking-hero">
        <div>
          <h1>
            {t('consulting.hero_title', lang)}
            <span> {t('consulting.hero_subtitle', lang)}</span>
          </h1>
          <p>{t('consulting.hero_desc', lang)}</p>
        </div>
      </section>

      {!submitted ? (
        <section className="dr-booking-shell">
          <div className={`dr-booking-services ${hasSelectedService ? 'is-complete' : 'is-active'}`}>
            <div className="dr-booking-section-title">
              <span>{t('consulting.step1', lang)}</span>
              <h2>
                {selectedServiceData ? selectedServiceData.title : t('consulting.step1_select', lang)}
              </h2>
            </div>

            {!isPresetLocked && (
              <div className="dr-booking-categories">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    className={selectedCategory === category.id ? 'is-active' : ''}
                    onClick={() => setSelectedCategory(category.id)}
                    aria-pressed={selectedCategory === category.id}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            )}

            {isPresetLocked && (
              <p className="dr-booking-locked-note">
                {t('consulting.step1_locked_note', lang)}
              </p>
            )}

            {isPresetLocked && (
              <button
                type="button"
                className="dr-booking-unlock-btn"
                onClick={() => setSelectionUnlocked(true)}
              >
                {t('consulting.step1_unlock', lang)}
              </button>
            )}

            <div className="dr-service-picker-grid">
              {filteredServices.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  className={`dr-booking-service-card ${
                    selectedService === service.id ? 'is-selected' : ''
                  }`}
                  aria-pressed={selectedService === service.id}
                  onClick={() => {
                    setSelectedService(service.id)
                    setSelectedTime('')

                    if (service.id === 'other') {
                      setIsCustomServiceConfirmed(false)
                      return
                    }

                    setCustomService('')
                    setIsCustomServiceConfirmed(true)

                    window.setTimeout(() => {
                      document
                        .querySelector('.dr-booking-calendar')
                        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }, 120)
                  }}
                >
                  <span className="dr-service-check">
                    {selectedService === service.id && <Check size={16} aria-hidden="true" />}
                  </span>

                  <strong>{service.title}</strong>

                  <span className="dr-service-meta">
                    <Clock size={14} aria-hidden="true" />
                    {service.duration}
                  </span>
                </button>
              ))}
            </div>

            {selectedService === 'other' && (
              <form className="dr-custom-service-field" onSubmit={handleCustomServiceSubmit}>
                <label>
                  {t('consulting.step1_other_label', lang)}
                  <div className="dr-custom-service-row">
                    <input
                      name="customService"
                      type="text"
                      value={customService}
                      onChange={(event) => {
                        setCustomService(event.target.value)
                        if (isCustomServiceConfirmed) setIsCustomServiceConfirmed(false)
                      }}
                      placeholder={t('consulting.step1_other_placeholder', lang)}
                      required
                    />

                    <button
                      className="dr-custom-service-submit"
                      type="submit"
                      disabled={!customService.trim()}
                    >
                      {t('consulting.step1_other_confirm', lang)}
                    </button>
                  </div>
                </label>
              </form>
            )}
          </div>

          <div
            className={`dr-booking-calendar ${
              hasSelectedService && !isCalendarLocked ? 'is-active' : ''
            } ${hasSelectedSlot ? 'is-complete' : ''}`}
          >
            <div className="dr-booking-section-title">
              <span>{t('consulting.step2', lang)}</span>
              <h2>
                {selectedTime
                  ? t('consulting.step2_title', lang)
                    .replace('{date}', selectedDateLabel)
                    .replace('{time}', selectedTime)
                  : t('consulting.step2_select', lang)}
              </h2>
            </div>

            <div className="dr-booking-carry">
              <span>{t('consulting.step2_carry_label', lang)}</span>
              <strong>{selectedServiceData?.title}</strong>
            </div>

            {isCalendarLocked && (
              <p className="dr-booking-locked-note">
                {t('consulting.step2_locked_note', lang)}
              </p>
            )}

            <div className="dr-calendar-panel">
              <div className="dr-calendar-head">
                <div>
                  <span>{t('consulting.step2_calendar_label', lang)}</span>
                  <strong className="dr-calendar-month">{monthLabel}</strong>
                </div>
                <em>
                  {t('consulting.step2_calendar_days', lang).replace(
                    '{count}',
                    availability.length,
                  )}
                </em>
              </div>

              <div className="dr-calendar-weekdays" aria-hidden="true">
                {weekDays.map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>

              <div className="dr-calendar-grid">
                {calendarDays.map((isoDate, index) => {
                  if (!isoDate) {
                    return <span key={`empty-${index}`} className="dr-calendar-empty" aria-hidden="true" />
                  }

                  const dayNumber = Number(isoDate.slice(-2))
                  const isAvailable = Boolean(availabilityByDate[isoDate])
                  const isSelected = selectedDate === isoDate

                  return (
                    <button
                      key={isoDate}
                      type="button"
                      disabled={!isAvailable || isCalendarLocked}
                      aria-pressed={isSelected}
                      className={`dr-calendar-day ${
                        isAvailable ? 'is-available' : 'is-unavailable'
                      } ${isSelected ? 'is-selected' : ''}`}
                      onClick={() => {
                        setSelectedDate(isoDate)
                        setSelectedTime('')
                      }}
                    >
                      <span>{dayNumber}</span>
                      {isAvailable && <small aria-hidden="true" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {selectedDateData && (
              <p className="dr-selected-day">
                {t('consulting.step2_selected_day', lang).split('{label}')[0]}
                <strong>{selectedDateLabel}</strong>
              </p>
            )}

            <div className="dr-time-grid">
              {selectedDateData?.times.map((time) => (
                <button
                  key={time}
                  type="button"
                  className={selectedTime === time ? 'is-active' : ''}
                  disabled={isCalendarLocked}
                  aria-pressed={selectedTime === time}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </button>
              ))}
            </div>

            <form className="dr-booking-form" onSubmit={handleSubmit}>
              <div className="dr-booking-section-title">
                <span>{t('consulting.step3', lang)}</span>
                <h2>
                  {hasSelectedSlot ? t('consulting.step3_ready', lang) : t('consulting.step3_select', lang)}
                </h2>
              </div>

              <div className="dr-booking-carry">
                <span>{t('consulting.step3_carry_label', lang)}</span>
                <strong>
                  {selectedServiceData?.title}
                  {selectedTime && ` - ${selectedDateLabel}, ${selectedTime}`}
                </strong>
              </div>

              <label>
                {t('consulting.form_name', lang)}
                <input name="name" type="text" required />
              </label>

              <label>
                {t('consulting.form_email', lang)}
                <input name="email" type="email" required />
              </label>

              <label>
                {t('consulting.form_phone', lang)}
                <input name="phone" type="tel" />
              </label>

              <label>
                {t('consulting.form_message', lang)}
                <textarea name="message" rows="4" />
              </label>

              {submitError && (
                <p className="dr-form-error">{submitError}</p>
              )}

              <button ref={submitButtonRef} type="submit" disabled={!selectedTime || submitting}>
                {submitting ? t('consulting.form_sending', lang) : t('consulting.form_submit', lang)}
                <Send size={18} aria-hidden="true" />
              </button>
            </form>
          </div>
        </section>
      ) : (
        <section className="dr-booking-confirmation is-sent">
          <div className="dr-booking-plane-stage" aria-hidden="true">
            <div className="dr-booking-plane">
              <Send size={30} aria-hidden="true" />
            </div>
            <div className="dr-booking-plane-trail" />
          </div>

          <span>{t('consulting.confirmation_sent', lang)}</span>
          <h2>{t('consulting.confirmation_title', lang)}</h2>
        </section>
      )}
    </main>
  )
}
