import { useEffect, useState } from 'react'
import { Download, Eye, X } from 'lucide-react'
import { useLanguage } from '../../context/useLanguage'
import { ebookFilesByLanguage } from '../../data/ebookFiles'
import { apiEndpoint } from '../../lib/api'
import { t } from '../../lib/i18n'
import './EbooksSection.scss'

export default function EbooksSection() {
  const [activeEbook, setActiveEbook] = useState(null)
  const [modalMode, setModalMode] = useState('preview')
  const [leadSent, setLeadSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const { lang } = useLanguage()
  const ebookFiles = ebookFilesByLanguage[lang] || ebookFilesByLanguage.ro
  const translatedEbooks = t('resources.ebooks', lang)
  const ebooks = (Array.isArray(translatedEbooks) ? translatedEbooks : []).map((ebook, index) => ({
    ...ebook,
    file: ebookFiles[index] || '#',
    language: lang,
  }))
  const canDownloadActiveEbook = Boolean(activeEbook?.file && activeEbook.file !== '#')
  const hasEbookFile = (ebook) => Boolean(ebook?.file && ebook.file !== '#')

  useEffect(() => {
    document.body.style.overflow = activeEbook ? 'hidden' : ''

    function closeOnEscape(event) {
      if (event.key === 'Escape') closeModal()
    }

    document.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [activeEbook])

  function closeModal() {
    setActiveEbook(null)
    setModalMode('preview')
    setLeadSent(false)
    setSubmitting(false)
    setError('')
  }

  function openModal(ebook, mode = 'preview') {
    setActiveEbook(ebook)
    setModalMode(mode)
    setLeadSent(false)
    setError('')
  }

  function triggerDownload(ebook) {
    if (!ebook?.file || ebook.file === '#') return

    const link = document.createElement('a')
    link.href = ebook.file
    link.download = ''
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  async function handleLeadSubmit(event) {
    event.preventDefault()
    if (!activeEbook || !hasEbookFile(activeEbook)) return

    const formData = new FormData(event.currentTarget)
    const payload = {
      source: 'ebooks-section',
      ebookTitle: activeEbook.title,
      ebookCategory: activeEbook.category,
      ebookLanguage: activeEbook.language,
      name: formData.get('name'),
      email: formData.get('email'),
      accepted: formData.get('accepted') === 'on',
    }

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch(apiEndpoint('/ebook-download'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Ebook lead submission failed')
      }

      setLeadSent(true)
      triggerDownload(activeEbook)
    } catch {
      setError(t('resources.ebooks_form_error', lang))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="dr-ebooks" id="resurse-ebookuri">
      <div className="dr-ebooks-header">
        <h2>{t('resources.ebooks_title', lang)}</h2>
        <p>{t('resources.ebooks_desc', lang)}</p>
      </div>

      <div className="dr-ebooks-grid">
        {ebooks.map((ebook) => {
          const canDownload = hasEbookFile(ebook)

          return (
          <article className="dr-ebook-card" key={ebook.title}>
            <div className="dr-ebook-preview">
              <span>{ebook.category}</span>
              <strong>{ebook.title}</strong>
            </div>

            <div className="dr-ebook-content">
              <span>{ebook.category}</span>
              <h3>{ebook.title}</h3>
              <p>{ebook.description}</p>

              <div className="dr-ebook-actions">
                <button type="button" onClick={() => openModal(ebook)}>
                  <Eye size={16} aria-hidden="true" />
                  {t('resources.ebooks_preview', lang)}
                </button>

                <button
                  className="dr-ebook-download-trigger"
                  type="button"
                  onClick={() => {
                    if (canDownload) openModal(ebook, 'download')
                  }}
                  disabled={!canDownload}
                >
                  <Download size={16} aria-hidden="true" />
                  {canDownload
                    ? t('resources.ebooks_download', lang)
                    : t('resources.ebooks_coming_soon', lang)}
                </button>
              </div>
            </div>
          </article>
          )
        })}
      </div>

      {activeEbook && (
        <div className="dr-ebook-modal" onClick={closeModal}>
          <div
            className="dr-ebook-modal-box"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dr-ebook-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="dr-ebook-close"
              type="button"
              onClick={closeModal}
              aria-label={t('common.close', lang)}
            >
              <X size={22} aria-hidden="true" />
            </button>

            <div className="dr-ebook-modal-orb dr-ebook-modal-orb-one" aria-hidden="true" />
            <div className="dr-ebook-modal-orb dr-ebook-modal-orb-two" aria-hidden="true" />

            <h3 id="dr-ebook-modal-title">{activeEbook.title}</h3>
            <p>{activeEbook.preview}</p>

            <div className="dr-ebook-fake-preview" aria-hidden="true">
              <div />
              <div />
              <div />
            </div>

            {modalMode === 'preview' ? (
              <button
                className="dr-ebook-download-main"
                type="button"
                onClick={() => {
                  if (canDownloadActiveEbook) setModalMode('download')
                }}
                disabled={!canDownloadActiveEbook}
              >
                <Download size={18} aria-hidden="true" />
                {canDownloadActiveEbook
                  ? t('resources.ebooks_download_main', lang)
                  : t('resources.ebooks_coming_soon', lang)}
              </button>
            ) : (
              <div className="dr-ebook-lead-panel">
                {!leadSent ? (
                  <>
                    <h4>{t('resources.ebooks_form_title', lang)}</h4>
                    <p>{t('resources.ebooks_form_desc', lang)}</p>

                    <form className="dr-ebook-lead-form" onSubmit={handleLeadSubmit}>
                      <label>
                        {t('resources.ebooks_form_name', lang)}
                        <input name="name" type="text" autoComplete="name" required />
                      </label>

                      <label>
                        {t('resources.ebooks_form_email', lang)}
                        <input name="email" type="email" autoComplete="email" required />
                      </label>

                      <label className="dr-ebook-lead-consent">
                        <input name="accepted" type="checkbox" required />
                        <span>{t('resources.ebooks_form_consent', lang)}</span>
                      </label>

                      {error && <p className="dr-form-error">{error}</p>}

                      <button type="submit" disabled={submitting}>
                        <Download size={17} aria-hidden="true" />
                        {submitting
                          ? t('resources.ebooks_form_sending', lang)
                          : t('resources.ebooks_form_submit', lang)}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="dr-ebook-lead-success">
                    <h4>{t('resources.ebooks_form_success_title', lang)}</h4>
                    <p>
                      {canDownloadActiveEbook
                        ? t('resources.ebooks_form_success_desc', lang)
                        : t('resources.ebooks_form_missing_file', lang)}
                    </p>

                    {canDownloadActiveEbook && (
                      <a className="dr-ebook-download-main" href={activeEbook.file} download>
                        <Download size={18} aria-hidden="true" />
                        {t('resources.ebooks_download_main', lang)}
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
