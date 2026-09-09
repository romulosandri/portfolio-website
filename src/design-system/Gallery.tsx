import type { ReactNode } from 'react'
import { AI_LOGOS, APP_LOGOS, LOGOS, SOCIAL_ICONS, SYMBOLS } from './catalog'
import { AiButton } from './AiButton'
import { AiLogo } from './AiLogo'
import { AppLogo } from './AppLogo'
import { ArrowButton } from './ArrowButton'
import { BookingButton } from './BookingButton'
import { Button } from './Button'
import { Card } from './Card'
import { Checkbox } from './Checkbox'
import { Dropdown, DropdownMenu, DropdownMenuItem } from './Dropdown'
import { Field, Input } from './Input'
import { FooterButton } from './FooterButton'
import { FooterSection } from './FooterSection'
import { GameButton } from './GameButton'
import { GameThumbnailImage } from './GameThumbnailImage'
import { HowAi } from './HowAi'
import { HumanImage } from './HumanImage'
import { KanbanColumn } from './KanbanColumn'
import { Letter, LETTER_CHARS, LETTER_STYLES } from './Letter'
import { Logo } from './Logo'
import { LogosTicker } from '../motion-system/LogosTicker'
import { NameLogo } from './NameLogo'
import { NavBar } from './NavBar'
import { NavItem } from './NavItem'
import { Pagination } from './Pagination'
import { PlusIcon } from './Icons'
import { RobotImage } from './RobotImage'
import { SendButton } from './SendButton'
import { SocialIcon } from './SocialIcon'
import { Symbol } from './Symbol'
import { Tab, TabMenu } from './Tabs'
import { Tag } from './Tag'
import { TalkButton } from './TalkButton'
import { WelcomeTag } from './WelcomeTag'
import { Wordmark } from './Wordmark'

const DROPDOWN_OPTIONS = [
  { value: 'saved', label: 'Saved' },
  { value: 'applied', label: 'Applied' },
  { value: 'interview', label: 'Interview' },
]

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-xl">
      <h2 className="text-h4 text-foreground-primary">{title}</h2>
      {children}
    </section>
  )
}

function Tile({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-sm">
      {children}
      <span className="text-body-small text-foreground-quaternary">{label}</span>
    </div>
  )
}

function Bleed({ children }: { children: ReactNode }) {
  return (
    <div className="w-[calc(100%+var(--spacing-2xl)*2)] -mx-2xl overflow-x-auto bg-background-secondary">
      {children}
    </div>
  )
}

export function DesignSystemGallery() {
  return (
    <div className="min-h-full overflow-auto bg-background-primary text-foreground-primary">
      <main className="mx-auto flex max-w-300 flex-col gap-4xl px-2xl py-3xl">
        <header className="flex flex-col gap-md">
          <p className="text-body-small text-foreground-tertiary">
            Design system
          </p>
          <h1 className="text-h2">Portfolio 2026</h1>
          <p className="max-w-160 text-body-default text-foreground-secondary">
            Components, logos, letters, and icons from Figma. Interactive states
            respond to hover. Open this view with <code>?ds=1</code>.
          </p>
        </header>

        <Section title="Button">
          <div className="flex flex-wrap items-end gap-2xl">
            <Tile label="default">
              <Button>Add job</Button>
            </Tile>
            <Tile label="hover">
              <Button forceHover>Add job</Button>
            </Tile>
            <Tile label="primary">
              <Button variant="primary">Save</Button>
            </Tile>
            <Tile label="primary hover">
              <Button forceHover variant="primary">
                Save
              </Button>
            </Tile>
            <Tile label="danger">
              <Button variant="danger">Delete</Button>
            </Tile>
            <Tile label="danger hover">
              <Button forceHover variant="danger">
                Delete
              </Button>
            </Tile>
            <Tile label="icon">
              <Button aria-label="Add" variant="icon">
                <PlusIcon />
              </Button>
            </Tile>
            <Tile label="icon hover">
              <Button aria-label="Add" forceHover variant="icon">
                <PlusIcon />
              </Button>
            </Tile>
            <Tile label="disabled">
              <Button disabled>Add job</Button>
            </Tile>
          </div>
        </Section>

        <Section title="Input field">
          <div className="flex w-full max-w-160 flex-col gap-xl">
            <Tile label="default">
              <Input placeholder="Search title, company, location" />
            </Tile>
            <Tile label="hover">
              <Input forceHover placeholder="Search title, company, location" />
            </Tile>
            <Tile label="focus">
              <Input forceFocus placeholder="Search title, company, location" />
            </Tile>
            <Tile label="disabled">
              <Input disabled placeholder="Search title, company, location" />
            </Tile>
            <Tile label="labeled / required">
              <Field id="ds-name" label="Your Name" labelTone="default" placeholder="John Doe Jr" required size="lg" />
            </Tile>
          </div>
        </Section>

        <Section title="Checkbox">
          <div className="flex flex-wrap items-center gap-2xl">
            <Tile label="unchecked">
              <Checkbox checked={false} label="Unchecked" />
            </Tile>
            <Tile label="unchecked hover">
              <Checkbox checked={false} forceHover label="Unchecked hover" />
            </Tile>
            <Tile label="checked">
              <Checkbox checked label="Checked" />
            </Tile>
            <Tile label="focus">
              <Checkbox checked={false} forceFocus label="Focus" />
            </Tile>
            <Tile label="disabled">
              <Checkbox checked disabled label="Disabled" />
            </Tile>
          </div>
        </Section>

        <Section title="Dropdown">
          <div className="flex flex-wrap items-start gap-2xl">
            <Tile label="default">
              <Dropdown label="Status" options={DROPDOWN_OPTIONS} value="saved" />
            </Tile>
            <Tile label="hover">
              <Dropdown forceHover label="Status" options={DROPDOWN_OPTIONS} value="saved" />
            </Tile>
            <Tile label="open">
              <Dropdown forceOpen label="Status" options={DROPDOWN_OPTIONS} value="saved" />
            </Tile>
            <Tile label="disabled">
              <Dropdown disabled label="Status" options={DROPDOWN_OPTIONS} value="saved" />
            </Tile>
          </div>
        </Section>

        <Section title="Dropdown menu">
          <div className="relative h-44 w-48">
            <DropdownMenu placement="static">
              <DropdownMenuItem>Saved</DropdownMenuItem>
              <DropdownMenuItem forceHover>Applied</DropdownMenuItem>
              <DropdownMenuItem selected>Interview</DropdownMenuItem>
              <DropdownMenuItem disabled>Offer</DropdownMenuItem>
            </DropdownMenu>
          </div>
        </Section>

        <Section title="Tab menu">
          <div className="flex w-full max-w-160 flex-col gap-xl">
            <Tile label="default / selected / hover">
              <TabMenu label="Jobs views">
                <Tab selected>Job board</Tab>
                <Tab>Kanban</Tab>
                <Tab forceHover>Archive</Tab>
              </TabMenu>
            </Tile>
          </div>
        </Section>

        <Section title="Pagination">
          <div className="flex flex-col gap-xl">
            <Tile label="default / current / hover">
              <Pagination forceHoverPage={3} page={2} pageCount={8} />
            </Tile>
          </div>
        </Section>

        <Section title="Card">
          <div className="grid w-full max-w-200 grid-cols-1 border-t border-l border-solid border-stroke-secondary md:grid-cols-3">
            <Card className="p-xl md:min-h-95" variant="cell">
              <p className="text-body-default text-foreground-primary">Value card</p>
              <p className="text-body-small text-foreground-secondary">Default cell used on Home.</p>
            </Card>
            <Card className="p-xl md:min-h-95" variant="cell">
              <p className="text-body-default text-foreground-primary">Second cell</p>
              <p className="text-body-small text-foreground-secondary">Same grid treatment.</p>
            </Card>
            <Card className="p-xl md:min-h-95" variant="cell">
              <p className="text-body-default text-foreground-primary">Third cell</p>
              <p className="text-body-small text-foreground-secondary">Closes the row.</p>
            </Card>
          </div>
          <div className="mt-xl flex flex-wrap items-start gap-2xl">
            <Tile label="job default">
              <Card className="w-64" variant="job">
                <p className="text-body-default text-foreground-primary">Linear</p>
                <p className="mt-sm text-body-default text-foreground-primary">Product Designer</p>
              </Card>
            </Tile>
            <Tile label="job hover">
              <Card className="w-64" forceHover variant="job">
                <p className="text-body-default text-foreground-primary">Linear</p>
                <p className="mt-sm text-body-default text-foreground-primary">Product Designer</p>
              </Card>
            </Tile>
            <Tile label="job dragging">
              <Card className="w-64" dragging variant="job">
                <p className="text-body-default text-foreground-primary">Linear</p>
                <p className="mt-sm text-body-default text-foreground-primary">Product Designer</p>
              </Card>
            </Tile>
          </div>
        </Section>

        <Section title="Kanban column">
          <div className="flex h-80 items-stretch gap-lg">
            <KanbanColumn count={2} label="Saved">
              <div className="flex flex-col gap-md">
                <Card variant="job">
                  <p className="text-body-default text-foreground-primary">Product Designer</p>
                </Card>
                <Card variant="job">
                  <p className="text-body-default text-foreground-primary">Design Engineer</p>
                </Card>
              </div>
            </KanbanColumn>
            <KanbanColumn count={0} label="Applied" over>
              <p className="px-md py-2xl text-center text-body-small text-foreground-quaternary">Drop target</p>
            </KanbanColumn>
          </div>
        </Section>

        <Section title="Booking button">
          <div className="flex flex-wrap items-center gap-2xl">
            <Tile label="default">
              <BookingButton href="#ds" />
            </Tile>
            <Tile label="hover">
              <BookingButton forceHover href="#ds" />
            </Tile>
          </div>
        </Section>

        <Section title="Send button">
          <div className="w-full max-w-160">
            <SendButton />
          </div>
        </Section>

        <Section title="Tag images">
          <div className="flex flex-wrap items-end gap-2xl">
            <Tile label="robot-image">
              <RobotImage />
            </Tile>
            <Tile label="human-image">
              <HumanImage />
            </Tile>
            <Tile label="game-thumbnail-image">
              <GameThumbnailImage />
            </Tile>
          </div>
        </Section>

        <Section title="Tag">
          <div className="flex flex-wrap items-center gap-xl">
            <Tile label="type=ai-agents">
              <Tag type="ai-agents" />
            </Tile>
            <Tile label="type=humans">
              <Tag type="humans" />
            </Tile>
          </div>
        </Section>

        <Section title="Welcome tag">
          <WelcomeTag />
        </Section>

        <Section title="Name logo">
          <NameLogo />
        </Section>

        <Section title="Arrow button">
          <div className="flex flex-wrap items-center gap-2xl">
            <Tile label="variant=default">
              <ArrowButton variant="default" />
            </Tile>
            <Tile label="variant=dark">
              <ArrowButton variant="dark" />
            </Tile>
          </div>
        </Section>

        <Section title="Game button">
          <div className="flex flex-wrap items-center gap-2xl">
            <Tile label="state=default">
              <GameButton />
            </Tile>
            <Tile label="state=hover">
              <GameButton forceHover />
            </Tile>
          </div>
        </Section>

        <Section title="Footer button">
          <div className="flex flex-wrap items-center gap-2xl bg-background-white p-xl">
            <Tile label="state=default">
              <FooterButton label="Work" />
            </Tile>
            <Tile label="hover the link">
              <FooterButton label="Work" />
            </Tile>
          </div>
        </Section>

        <Section title="AI button">
          <div className="flex flex-wrap items-center gap-xl">
            <Tile label="openai">
              <AiButton name="openai" />
            </Tile>
            <Tile label="claude">
              <AiButton name="claude" />
            </Tile>
            <Tile label="grok">
              <AiButton name="grok" />
            </Tile>
            <Tile label="perplexity">
              <AiButton name="perplexity" />
            </Tile>
          </div>
        </Section>

        <Section title="Nav item">
          <div className="flex flex-wrap items-center gap-2xl">
            <Tile label="state=default">
              <NavItem label="Work" />
            </Tile>
            <Tile label="state=selected">
              <NavItem label="Work" selected />
            </Tile>
            <Tile label="hover for icon">
              <NavItem label="Projects" />
            </Tile>
          </div>
        </Section>

        <Section title="How AI">
          <div className="flex flex-col gap-xl">
            <Tile label="state=default">
              <div className="w-full min-w-180">
                <HowAi />
              </div>
            </Tile>
            <Tile label="state=hover">
              <div className="w-full min-w-180">
                <HowAi forceHover />
              </div>
            </Tile>
          </div>
        </Section>

        <Section title="Talk button">
          <div className="flex flex-col gap-xl">
            <Tile label="state=default">
              <div className="w-full min-w-180">
                <TalkButton />
              </div>
            </Tile>
            <Tile label="state=hover">
              <div className="w-full min-w-180">
                <TalkButton forceHover />
              </div>
            </Tile>
          </div>
        </Section>

        <Section title="Nav bar">
          <Bleed>
            <NavBar />
          </Bleed>
        </Section>

        <Section title="Logos ticker">
          <Bleed>
            <LogosTicker />
          </Bleed>
        </Section>

        <Section title="Footer section">
          <Bleed>
            <FooterSection />
          </Bleed>
        </Section>

        <Section title="Letters">
          <div className="flex flex-col gap-2xl" style={{ zoom: 2.5 }}>
            <div className="flex flex-wrap items-end gap-2xl">
              <Wordmark style={1} text="romul" />
              <Wordmark style={1} text="sand" />
              <Wordmark style={1} text="i" />
            </div>
            {LETTER_CHARS.map((letter) => (
              <div className="flex flex-col gap-sm" key={letter}>
                <p className="text-body-small uppercase text-foreground-tertiary">
                  {letter}
                </p>
                <div className="flex flex-wrap items-end gap-xl">
                  {LETTER_STYLES.map((style) => (
                    <Letter key={`${letter}-${style}`} letter={letter} style={style} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="App logos">
          <div className="flex flex-wrap items-center gap-2xl" style={{ zoom: 2 }}>
            {(Object.keys(APP_LOGOS) as Array<keyof typeof APP_LOGOS>).map((name) => (
              <Tile key={name} label={name}>
                <AppLogo name={name} />
              </Tile>
            ))}
          </div>
        </Section>

        <Section title="Client logos">
          <div className="flex flex-wrap items-center gap-3xl">
            {(Object.keys(LOGOS) as Array<keyof typeof LOGOS>).map((name) => (
              <Tile key={name} label={name}>
                <Logo name={name} />
              </Tile>
            ))}
          </div>
        </Section>

        <Section title="Symbols">
          <div className="flex flex-wrap items-center gap-xl" style={{ zoom: 2 }}>
            {(Object.keys(SYMBOLS) as Array<keyof typeof SYMBOLS>).map((variant) => (
              <Tile key={variant} label={String(variant)}>
                <Symbol variant={variant} />
              </Tile>
            ))}
          </div>
        </Section>

        <Section title="Social icons">
          <div className="flex flex-wrap items-center gap-2xl" style={{ zoom: 2 }}>
            {(Object.keys(SOCIAL_ICONS) as Array<keyof typeof SOCIAL_ICONS>).map(
              (type) => (
                <Tile key={type} label={type}>
                  <SocialIcon type={type} />
                </Tile>
              ),
            )}
          </div>
        </Section>

        <Section title="AI logos">
          <div className="flex flex-wrap items-center gap-2xl" style={{ zoom: 2 }}>
            {(Object.keys(AI_LOGOS) as Array<keyof typeof AI_LOGOS>).map((name) => (
              <Tile key={name} label={name}>
                <AiLogo name={name} />
              </Tile>
            ))}
          </div>
        </Section>
      </main>
    </div>
  )
}
