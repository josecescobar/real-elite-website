import MultiStepEstimateForm from '@/components/shared/MultiStepEstimateForm';

/**
 * Maps service-page slug → MultiStepEstimateForm option value so the form
 * pre-selects the matching service on a service page.
 */
const SLUG_TO_FORM_VALUE: Record<string, string> = {
  bathrooms: 'bathroom-remodel',
  kitchens: 'kitchen-remodel',
  basements: 'basement-finish',
  remodeling: 'whole-home-remodel',
  decks: 'decks-outdoor',
  roofing: 'roofing',
  siding: 'siding',
  additions: 'addition',
  'exterior-repairs': 'repairs',
  'general-repairs': 'repairs',
  handyman: 'repairs',
};

type Props = { initialService?: string };

export default function StickyEstimateRail({ initialService }: Props) {
  const formValue =
    initialService && SLUG_TO_FORM_VALUE[initialService]
      ? (SLUG_TO_FORM_VALUE[initialService] as Parameters<
          typeof MultiStepEstimateForm
        >[0]['initialService'])
      : undefined;

  return (
    <aside aria-label="Get an estimate" className="lg:sticky lg:top-24" id="estimate">
      <MultiStepEstimateForm initialService={formValue} />
    </aside>
  );
}
