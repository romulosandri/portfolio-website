import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Button, Dialog, Field } from '../design-system'
import { CompanyLogo } from './CompanyLogo'
import { resolveCompanyDomain } from './display'

type AddJobDialogProps = {
  pending?: boolean
  onCancel: () => void
  onSubmit: (input: { title: string; company: string; url: string; location?: string }) => Promise<void>
}

export function AddJobDialog({ pending = false, onCancel, onSubmit }: AddJobDialogProps) {
  const titleRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState('')
  const [company, setCompany] = useState('')
  const [url, setUrl] = useState('')
  const [location, setLocation] = useState('')
  const previewDomain = useMemo(() => resolveCompanyDomain(url, company), [url, company])

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return
    await onSubmit({
      title: title.trim(),
      company: company.trim(),
      url: url.trim(),
      location: location.trim() || undefined,
    })
  }

  return (
    <Dialog closeDisabled={pending} labelledBy="jobs-add-title" onClose={onCancel}>
      <form onSubmit={handleSubmit}>
        <h2 className="text-h3 text-foreground-primary" id="jobs-add-title">
          Add job
        </h2>

        <div className="mt-xl flex flex-col gap-lg">
          <Field
            autoComplete="off"
            disabled={pending}
            id="job-title"
            label="Role"
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Product Designer"
            ref={titleRef}
            required
            value={title}
          />
          <div className="flex items-end gap-md">
            <div className="min-w-0 flex-1">
              <Field
                autoComplete="organization"
                disabled={pending}
                id="job-company"
                label="Company"
                onChange={(event) => setCompany(event.target.value)}
                placeholder="Linear"
                required
                value={company}
              />
            </div>
            <CompanyLogo domain={previewDomain} name={company.trim() || 'Company'} />
          </div>
          <Field
            autoComplete="url"
            disabled={pending}
            id="job-url"
            label="Application URL"
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://"
            required
            type="url"
            value={url}
          />
          <Field
            autoComplete="off"
            disabled={pending}
            id="job-location"
            label="Location"
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Remote — Latin America"
            value={location}
          />
        </div>

        <div className="mt-xl flex justify-end gap-sm">
          <Button disabled={pending} onClick={onCancel}>
            Cancel
          </Button>
          <Button disabled={pending} type="submit" variant="primary">
            {pending ? 'Adding…' : 'Add job'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
