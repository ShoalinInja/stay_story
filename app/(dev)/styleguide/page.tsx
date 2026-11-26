import type { ReactNode } from "react";
import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { ArrowRight, Car, Heart, MapPin, Sailboat, UtensilsCrossed, Waves } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Card,
  Chip,
  Combobox,
  DateRangePicker,
  GuestStepper,
  IconBlob,
  Input,
  Modal,
  PriceBlock,
  Rail,
  RailArrows,
  RailProgress,
  RailTrack,
  RatingPill,
  SectionHeader,
  Sheet,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/primitives";
import { ControlledDatesDemo, ControlledGuestsDemo, ToastDemo } from "./demos";

// Dev-only QA page: not linked from site navigation, never indexed.
export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const SWATCHES = [
  ["ink", "bg-ink", "#1E1E1E"],
  ["ink-2", "bg-ink-2", "#394050"],
  ["muted-text", "bg-muted-text", "#6D717F"],
  ["muted-2", "bg-muted-2", "#9FA2AE"],
  ["line", "bg-line", "#D2D2D2"],
  ["line-soft", "bg-line-soft", "#E5E7EA"],
  ["cream", "bg-cream", "#FAF7F2"],
  ["surface", "bg-surface", "#FFFFFF"],
  ["surface-2", "bg-surface-2", "#F9FAFB"],
  ["cta", "bg-cta", "#1D1C2B"],
  ["brand", "bg-brand", "#FB9D5C"],
  ["brand-strong", "bg-brand-strong", "#C2611F"],
  ["brand-tint", "bg-brand-tint", "#FDE6D3"],
  ["star", "bg-star", "#E89B00"],
  ["footer-bg", "bg-footer-bg", "#1E1E1E"],
  ["success", "bg-success", "#1F9D55"],
  ["whatsapp", "bg-whatsapp", "#25D366"],
] as const;

const TYPE = [
  ["type-h1", "Playfair 600 · 48/56 (mobile 32/40)", "Goa stays, handled end to end"],
  ["type-h2", "Playfair 600 · 28/36", "Pick a Destination"],
  ["type-h3", "Inter 600 · 16/24", "Villa Azul, Siolim"],
  ["type-body", "Inter 400 · 15/24", "A quiet four-bedroom villa with a private pool, ten minutes from the beach."],
  ["type-meta", "Inter 400 · 13/20 muted", "Up to 12 Guests + 4 Rooms + 4 Baths"],
  ["type-price", "Inter 700 · 20/28", "₹12,676"],
] as const;

const AREA_OPTIONS = [
  { value: "siolim", label: "Siolim", group: "North Goa" },
  { value: "assagao", label: "Assagao", group: "North Goa" },
  { value: "anjuna", label: "Anjuna", group: "North Goa" },
  { value: "candolim", label: "Candolim", group: "North Goa" },
  { value: "palolem", label: "Palolem", group: "South Goa" },
  { value: "colva", label: "Colva", group: "South Goa" },
  { value: "villa", label: "Villas", group: "Stay types" },
  { value: "apartment", label: "Apartments", group: "Stay types" },
];

const BLOBS: [LucideIcon, string][] = [
  [Waves, "Beachside"],
  [Sailboat, "Yacht add-ons"],
  [UtensilsCrossed, "Private chef"],
  [Car, "Airport pickup"],
];

const RAIL_ITEMS = ["Siolim", "Assagao", "Anjuna", "Candolim", "Vagator", "Palolem", "Colva", "Panjim"];

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t border-line-soft py-10">
      <h2 id={id} className="mb-6 type-h2">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <p className="mb-2 type-meta">{children}</p>;
}

export default function StyleguidePage() {
  return (
    <main id="main" className="container-site pb-24">
      <header className="py-10">
        <p className="type-meta">Dev only · noindex</p>
        <h1 className="type-h1">StayStory styleguide</h1>
        <p className="mt-2 type-body text-muted-text">
          Every primitive in every state. Tab through the page to check focus rings.
        </p>
      </header>

      <Section id="sg-colours" title="Colours">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {SWATCHES.map(([name, cls, hex]) => (
            <li key={name} className="overflow-hidden rounded-card border border-line-soft">
              <div className={`h-16 ${cls}`} />
              <div className="p-2">
                <p className="text-sm font-semibold">{name}</p>
                <p className="type-meta">{hex}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 type-body">
          Orange text uses <span className="font-semibold text-brand-strong">text-brand-strong</span>; plain brand fails
          AA on white.
        </p>
      </Section>

      <Section id="sg-type" title="Type scale">
        <div className="flex flex-col gap-6">
          {TYPE.map(([cls, spec, sample]) => (
            <div key={cls}>
              <Label>
                {cls} · {spec}
              </Label>
              <p className={cls}>{sample}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="sg-button" title="Button">
        <div className="flex flex-col gap-6">
          {(["dark", "outline", "pill", "ghost"] as const).map((variant) => (
            <div key={variant}>
              <Label>{variant} · sm / md / lg / disabled</Label>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant={variant} size="sm">
                  Enquire Now
                </Button>
                <Button variant={variant}>Enquire Now</Button>
                <Button variant={variant} size="lg">
                  Enquire Now <ArrowRight aria-hidden />
                </Button>
                <Button variant={variant} disabled>
                  Disabled
                </Button>
              </div>
            </div>
          ))}
          <div>
            <Label>icon-circle · sm / md / lg / disabled</Label>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="icon-circle" size="sm" aria-label="Save to wishlist">
                <Heart aria-hidden />
              </Button>
              <Button variant="icon-circle" aria-label="View stay">
                <ArrowRight aria-hidden />
              </Button>
              <Button variant="icon-circle" size="lg" aria-label="View stay">
                <ArrowRight aria-hidden />
              </Button>
              <Button variant="icon-circle" disabled aria-label="View stay (disabled)">
                <ArrowRight aria-hidden />
              </Button>
            </div>
          </div>
          <div>
            <Label>asChild (renders a link)</Label>
            <Button asChild variant="pill">
              <Link href="/stays">Explore stays</Link>
            </Button>
          </div>
        </div>
      </Section>

      <Section id="sg-tabs" title="Tabs and chips">
        <Label>Underline tabs (arrow keys move between tabs)</Label>
        <Tabs defaultValue="all">
          <TabsList aria-label="Filter stays">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="north">North Goa</TabsTrigger>
            <TabsTrigger value="south">South Goa</TabsTrigger>
            <TabsTrigger value="pool">Pool Villas</TabsTrigger>
            <TabsTrigger value="off" disabled>
              Disabled
            </TabsTrigger>
          </TabsList>
          <TabsContent value="all">All stays panel</TabsContent>
          <TabsContent value="north">North Goa panel</TabsContent>
          <TabsContent value="south">South Goa panel</TabsContent>
          <TabsContent value="pool">Pool villas panel</TabsContent>
        </Tabs>
        <div className="mt-8">
          <Label>Pill chips · default / selected / with icon / disabled / link</Label>
          <div className="flex flex-wrap gap-2">
            <Chip selected={false}>Couples</Chip>
            <Chip selected>Families</Chip>
            <Chip>
              <MapPin aria-hidden /> Siolim
            </Chip>
            <Chip disabled>Disabled</Chip>
            <Chip asChild>
              <Link href="/stays">Link chip</Link>
            </Chip>
          </div>
        </div>
      </Section>

      <Section id="sg-badge" title="Badge and rating">
        <div className="flex flex-wrap items-center gap-3">
          <Badge>Best Rated</Badge>
          <Badge>New</Badge>
          <Badge variant="brand-tint">Valid till 31 Dec</Badge>
          <RatingPill value={4.8} count={126} />
          <RatingPill value={4.5} />
        </div>
        <p className="mt-4 type-meta">
          RatingPill with value null, 0 and NaN renders nothing between these brackets: [
          <RatingPill value={null} />
          <RatingPill value={0} />
          <RatingPill value={Number.NaN} />]
        </p>
      </Section>

      <Section id="sg-price" title="PriceBlock">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label>per-night</Label>
            <PriceBlock amount={12676} />
          </div>
          <div>
            <Label>null → on request (no + taxes)</Label>
            <PriceBlock amount={null} />
          </div>
          <div>
            <Label>0 → on request</Label>
            <PriceBlock amount={0} />
          </div>
          <div>
            <Label>monthly</Label>
            <PriceBlock amount={85000} mode="monthly" />
          </div>
          <div>
            <Label>sale (en-IN lakh/crore grouping)</Label>
            <PriceBlock amount={32500000} mode="sale" />
          </div>
          <div>
            <Label>with prefix (services)</Label>
            <PriceBlock amount={4500} prefix="Price from" suffix="per person" />
          </div>
        </div>
      </Section>

      <Section id="sg-section-header" title="SectionHeader">
        <SectionHeader title="Featured stays" link={{ href: "/stays", label: "View all" }} />
        <SectionHeader title="With description" description="Hand-picked villas across North and South Goa." />
      </Section>

      <Section id="sg-rail" title="Rail (carousel)">
        <Rail label="Destinations">
          <SectionHeader title="Pick a Destination" actions={<RailArrows />} />
          <RailTrack slideClassName="basis-[220px]">
            {RAIL_ITEMS.map((area) => (
              <Card key={area} interactive asChild className="flex h-40 items-end bg-cream p-4">
                <Link href={`/areas/${area.toLowerCase()}`}>
                  <span className="type-h3">{area}</span>
                </Link>
              </Card>
            ))}
          </RailTrack>
          <RailProgress />
        </Rail>
        <div className="mt-10">
          <Rail label="Autoplay demo" autoplay={5000} options={{ loop: true }}>
            <SectionHeader title="Autoplay (5s, pauses on hover/focus, off with reduced motion)" actions={<RailArrows />} />
            <RailTrack slideClassName="basis-full md:basis-1/2">
              {RAIL_ITEMS.slice(0, 4).map((area) => (
                <Card key={area} className="grid h-40 place-items-center bg-brand-tint">
                  <p className="type-h2">{area}</p>
                </Card>
              ))}
            </RailTrack>
          </Rail>
        </div>
      </Section>

      <Section id="sg-card" title="Card">
        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="p-5">
            <p className="type-h3">Static card</p>
            <p className="type-meta">shadow-card, 12px radius</p>
          </Card>
          <Card interactive asChild>
            <Link href="/stays" className="block p-5">
              <p className="type-h3">Interactive card (hover or focus)</p>
              <p className="type-meta">shadow-card-hover + translateY(-2px)</p>
            </Link>
          </Card>
        </div>
      </Section>

      <Section id="sg-input" title="Input">
        <div className="grid max-w-3xl gap-6 sm:grid-cols-2">
          <Input id="sg-name" label="Full name" placeholder="Your name" />
          <Input id="sg-phone" label="Phone" type="tel" hint="10-digit Indian mobile" placeholder="98765 43210" />
          <Input id="sg-email" label="Email" type="email" defaultValue="not-an-email" error="Enter a valid email" />
          <Input id="sg-disabled" label="Disabled" disabled defaultValue="Read only" />
        </div>
      </Section>

      <Section id="sg-combobox" title="Combobox">
        <div className="grid max-w-3xl gap-6 sm:grid-cols-2">
          <Combobox id="sg-where" label="Where in Goa" options={AREA_OPTIONS} placeholder="Search areas or stay types" name="area" />
          <Combobox id="sg-where-set" label="Preselected" options={AREA_OPTIONS} defaultValue="assagao" />
          <Combobox id="sg-where-err" label="With error" options={AREA_OPTIONS} error="Choose an area" />
          <Combobox id="sg-where-off" label="Disabled" options={AREA_OPTIONS} disabled />
        </div>
      </Section>

      <Section id="sg-guests" title="GuestStepper">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <Label>Uncontrolled (min reached: minus disabled)</Label>
            <GuestStepper defaultValue={{ adults: 1, children: 0, rooms: 1 }} />
          </div>
          <div>
            <Label>Controlled</Label>
            <ControlledGuestsDemo />
          </div>
        </div>
      </Section>

      <Section id="sg-dates" title="DateRangePicker">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <Label>Controlled, ISO output (2 months desktop, bottom sheet under 768px)</Label>
            <ControlledDatesDemo />
          </div>
          <div className="flex flex-col gap-6">
            <div>
              <Label>Error</Label>
              <DateRangePicker id="sg-dates-err" error="Check-out must be after check-in" />
            </div>
            <div>
              <Label>Disabled</Label>
              <DateRangePicker id="sg-dates-off" disabled />
            </div>
          </div>
        </div>
      </Section>

      <Section id="sg-overlays" title="Sheet, Modal and Toast">
        <div className="flex flex-wrap gap-3">
          <Sheet
            trigger={<Button variant="outline">Open bottom sheet</Button>}
            title="Filters"
            description="Focus is trapped; Esc closes and focus returns to the button."
            footer={<Button className="w-full">Show stays</Button>}
          >
            <div className="flex flex-wrap gap-2">
              <Chip>Private pool</Chip>
              <Chip>Pet friendly</Chip>
              <Chip>Beachside</Chip>
            </div>
          </Sheet>
          <Sheet trigger={<Button variant="outline">Open side sheet</Button>} title="Menu" side="left">
            <p className="type-body">Drawer content</p>
          </Sheet>
          <Modal trigger={<Button variant="dark">Request Callback</Button>} title="Request a callback" description="We'll call you back within working hours.">
            <Input id="sg-modal-phone" label="Phone" type="tel" />
            <Button className="w-full">Call me back</Button>
          </Modal>
          <ToastDemo />
        </div>
      </Section>

      <Section id="sg-accordion" title="Accordion">
        <Accordion type="single" collapsible className="max-w-2xl">
          <AccordionItem value="a">
            <AccordionTrigger>Is breakfast included?</AccordionTrigger>
            <AccordionContent>It depends on the stay; each listing shows its meal options.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>Can you arrange airport pickup?</AccordionTrigger>
            <AccordionContent>Yes, ask in your enquiry and we will confirm.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="c" disabled>
            <AccordionTrigger>Disabled item</AccordionTrigger>
            <AccordionContent>Hidden</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Section>

      <Section id="sg-iconblob" title="IconBlob">
        <ul className="flex flex-wrap gap-8">
          {BLOBS.map(([Icon, label]) => (
            <li key={label} className="flex flex-col items-center gap-2">
              <IconBlob icon={Icon} />
              <span className="text-sm font-semibold">{label}</span>
            </li>
          ))}
          <li className="flex flex-col items-center gap-2">
            <IconBlob icon={MapPin} size="lg" />
            <span className="text-sm font-semibold">Large</span>
          </li>
        </ul>
      </Section>
    </main>
  );
}
