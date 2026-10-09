/**
 * The design-build process — five steps, shared by the homepage preview and
 * the /process page so the two cannot drift.
 *
 * Written as a description of the method, not as operational promises: no
 * response-time, update-cadence or site-condition commitments live here. Those
 * are registered claims (src/lib/claims.ts) and belong only where the owner has
 * confirmed them.
 */

export type ProcessStep = {
  step: string;
  title: string;
  /** One or two sentences for the homepage preview. */
  summary: string;
  /** The longer read on /process. */
  detail: string[];
  /** What the homeowner has in hand at the end of the step. */
  deliverable: string;
};

export const DESIGN_BUILD_PROCESS: readonly ProcessStep[] = [
  {
    step: '01',
    title: 'Conversation',
    summary:
      'A short call about the house, the rooms in question and the range you have in mind. If it fits, we come out to measure and photograph.',
    detail: [
      'You tell us what the house is, what is not working and roughly what you expect to invest. We tell you honestly whether it is a design-build project or something the standard estimate serves better.',
      'The first site visit is about the building: structure, mechanicals, access, where the plumbing stacks run, what the HOA or the town will want to see.',
      'If you already have a designer or an architect, we read their set at this stage and build to it.',
    ],
    deliverable: 'A clear yes or no on fit, and a date to measure.',
  },
  {
    step: '02',
    title: 'Design & scope',
    summary:
      'Drawings, selections and a written scope, so the price is built from a documented plan rather than an allowance guess.',
    detail: [
      'Layout options, then a chosen direction, then the drawings the county and your HOA will need. Structural or engineered elements are drawn before they are priced.',
      'Selections are made in showrooms, not from a catalogue: cabinetry, stone, tile, plumbing and lighting are specified by product so the number means something.',
      'The scope is written line by line, including what is excluded, with allowances named where a product is still open.',
    ],
    deliverable: 'A drawing set, a selections schedule and a written scope with the investment.',
  },
  {
    step: '03',
    title: 'Approvals',
    summary:
      'County permits, town zoning where it applies, and the HOA architectural application, sequenced before demolition starts.',
    detail: [
      'Loudoun permits are filed through LandMARC with the drawings from step two. Inside Leesburg, Purcellville and Middleburg, the town zoning approval comes first.',
      'The HOA package (Brambleton, Broadlands, Lansdowne, Ashburn Village and the rest) is prepared and submitted in parallel; a county permit is not HOA approval, and the schedule allows for both.',
      'Historic-district reviews in Waterford, Leesburg’s Old and Historic District and Middleburg are planned for from the start.',
    ],
    deliverable: 'Permits issued, HOA approval in hand, and a start date that is real.',
  },
  {
    step: '04',
    title: 'Build',
    summary:
      'One project lead from the first day to the last. The house is protected, the schedule is written, and you hear about a change before it happens.',
    detail: [
      'Floors, stairs and the rooms you keep living in are protected before demolition. Dust is contained to the work zone.',
      'Trades are sequenced from the drawings: rough-ins, inspections, drywall, then the finish work where a project reads as custom.',
      'Changes are written up and priced before they are built. Nothing on the invoice should be a surprise.',
    ],
    deliverable: 'A finished room built to the drawings you approved.',
  },
  {
    step: '05',
    title: 'Walkthrough & care',
    summary:
      'A punch list you sign off on, the documentation handed over, and a follow-up once you have lived in the space.',
    detail: [
      'We walk the finished work together and write the punch list. Each item is cleared before sign-off.',
      'Permit close-outs, care instructions and the as-built drawings are handed over in one package.',
      'A follow-up visit after you have lived in the space, because that is when you notice what a walkthrough cannot.',
    ],
    deliverable: 'A closed permit, a documented home and a contractor who still picks up.',
  },
];
