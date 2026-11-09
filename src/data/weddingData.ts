import { 
  MonthMilestone, 
  Task, 
  RentalItem, 
  DressItem, 
  EventDaySchedule,
  DecisionPoint,
  PlanningNote,
  PreWeddingTripPlan,
  PreWeddingTripType,
  PreWeddingLook,
  PreWeddingChecklistItem,
  PreWeddingStoryReel,
  StoryReelScene,
  LocationOption,
  PropItem
} from '../types/wedding';

export const INITIAL_MILESTONES: MonthMilestone[] = [
  { id: 'oct-2026', name: 'October 2026', monthLabel: 'Oct 2026', timeframe: 'Current Month (4 Mo to Go)', badge: 'Oct 2026: Core Dependencies' },
  { id: 'nov-2026', name: 'November 2026', monthLabel: 'Nov 2026', timeframe: '3 Months to Go', badge: 'Nov 2026: Outfits & Makeup' },
  { id: 'dec-2026', name: 'December 2026', monthLabel: 'Dec 2026', timeframe: '2 Months to Go', badge: 'Dec 2026: Catering & Staff' },
  { id: 'jan-2027', name: 'January 2027', monthLabel: 'Jan 2027', timeframe: '1 Month to Go', badge: 'Jan 2027: Chab & Envelopes' },
  { id: 'feb-prep', name: 'Feb 1 - 14, 2027', monthLabel: 'Feb 1-14', timeframe: 'Wedding Month Prep', badge: 'Feb 1-14: Final Fittings & ICER' },
  { id: 'feb-days', name: 'Feb 15 - 21, 2027', monthLabel: 'Feb 15-21', timeframe: 'Wedding Week', badge: 'Event Week: Feb 15-21 Celebrations' }
];

export const INITIAL_TASKS: Task[] = [
  // October 2026 (Current Month - Real Dependencies from Notes)
  { 
    id: 't-oct-1', 
    title: 'Ask elders: Annual function in first half or second half?', 
    category: 'rituals', 
    assignedTo: 'Family', 
    side: 'Both',
    monthId: 'oct-2026', 
    dueDate: '2026-10-05',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Kam - Ask annual function first half or second half.'
  },
  { 
    id: 't-oct-2', 
    title: 'Ask elders: Marriage together at Silver Farm or separate mandvos?', 
    category: 'rituals', 
    assignedTo: 'Family', 
    side: 'Both',
    monthId: 'oct-2026', 
    dueDate: '2026-10-08',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Kam - Ask about marriage together or separate.'
  },
  { 
    id: 't-oct-5', 
    title: 'Check Silver Farm for dome availability vs constructing standalone mandvo', 
    category: 'venue', 
    assignedTo: 'Family', 
    side: 'Both',
    monthId: 'oct-2026', 
    dueDate: '2026-10-12',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: dome ma karvanu dome hoi to nakar mandvo banavano hoi.'
  },
  { 
    id: 't-oct-3', 
    title: 'Call Dhaval Jajenwala to get generator rental contact number', 
    category: 'rentals', 
    assignedTo: 'Groom', 
    side: 'Boy',
    monthId: 'oct-2026', 
    dueDate: '2026-10-15',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Get generator contact from dhaval, available on rent.'
  },
  { 
    id: 't-oct-6', 
    title: 'Lock DJ & Sound package with Dhaval Jajenwala (Haldi ₹4k, Garba ₹24k, Jaan ICER ₹15k, Lagan ₹4k)', 
    category: 'sound_dj', 
    assignedTo: 'Groom', 
    side: 'Boy',
    monthId: 'oct-2026', 
    dueDate: '2026-10-18',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Dhaval jajenwala Silver ma karelu che 20, 21 feb 2027.'
  },
  { 
    id: 't-oct-4', 
    title: 'Pre-Wedding Shoot: Decide Trip Scope (National 2–3 Days in Udaipur/Goa vs International 1 Week in Dubai/Bali)', 
    category: 'outfits', 
    assignedTo: 'Both', 
    side: 'Both',
    monthId: 'oct-2026', 
    dueDate: '2026-10-22',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Photo graphy - find location (we find). Multi-day travel shoot, independent from Feb 15 home rituals.'
  },
  { 
    id: 't-oct-4b', 
    title: 'Shortlist Photography & Cinematography Crew with Drone for Pre-Wedding Shoot trip', 
    category: 'outfits', 
    assignedTo: 'Both', 
    side: 'Both',
    monthId: 'oct-2026', 
    dueDate: '2026-10-28',
    completed: false, 
    priority: 'high',
    notes: 'Confirm package: 1 cinematic film, 2 Instagram reels, 40 edited photos, teaser, and Feb 20 Garba LED cut.'
  },

  // November 2026 (Outfits, Makeup & Pre-Wedding)
  { 
    id: 't-nov-5', 
    title: 'Bride: Book makeup parlour for Feb 20 (Strict morning slot: 11:00 AM – 12:00 PM start)', 
    category: 'outfits', 
    assignedTo: 'Bride', 
    side: 'Girl',
    monthId: 'nov-2026', 
    dueDate: '2026-11-04',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: 20 th Feb Parlour: 11 AM or 12 PM start.'
  },
  { 
    id: 't-nov-6', 
    title: 'Bride: Finalize wedding clothes (Lagan-Lakhan, Mehndi, Haldi, Mandvo, Garba chaniya choli, Lagan)', 
    category: 'outfits', 
    assignedTo: 'Bride', 
    side: 'Girl',
    monthId: 'nov-2026', 
    dueDate: '2026-11-08',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: GIRLS: Kapda, Mackup, Lagan - Lakhan, Vana - rasam, Mehndi, Geet gunjan.'
  },
  { 
    id: 't-nov-2', 
    title: 'Groom: Order or tailor Varghodo Jodhpuri / Suit (Feb 19 evening)', 
    category: 'outfits', 
    assignedTo: 'Groom', 
    side: 'Boy',
    monthId: 'nov-2026', 
    dueDate: '2026-11-12',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Sanje varghodo jodhpuri jevu ka to suit.'
  },
  { 
    id: 't-nov-3', 
    title: 'Groom: Order or tailor Lagan Wedding Suit (Feb 21 morning)', 
    category: 'outfits', 
    assignedTo: 'Groom', 
    side: 'Boy',
    monthId: 'nov-2026', 
    dueDate: '2026-11-15',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: 21 lagan ma suit.'
  },
  { 
    id: 't-nov-4', 
    title: 'Groom: Buy traditional coty (bandi) & kurta for Grah Shanti & Mandvo (Feb 20 noon)', 
    category: 'outfits', 
    assignedTo: 'Groom', 
    side: 'Boy',
    monthId: 'nov-2026', 
    dueDate: '2026-11-19',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Bapore ghrah shanti traditional coty.'
  },
  { 
    id: 't-nov-1', 
    title: 'Groom: Buy Haldi kurta pajama (Blue / White / Lavender color theme)', 
    category: 'outfits', 
    assignedTo: 'Groom', 
    side: 'Boy',
    monthId: 'nov-2026', 
    dueDate: '2026-11-22',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: 20 saware haldi ma kurta payjama, blue theme, white, lavender.'
  },
  { 
    id: 't-nov-7', 
    title: 'Execute pre-wedding couple photoshoot at chosen location', 
    category: 'outfits', 
    assignedTo: 'Both', 
    side: 'Both',
    monthId: 'nov-2026', 
    dueDate: '2026-11-28',
    completed: false, 
    priority: 'medium',
    notes: 'Direct from user notes: BOYS: Pre-wedding, Photo graphy - find location.'
  },

  // December 2026 (Food, Staffing & Farm Manpower)
  { 
    id: 't-dec-1', 
    title: 'Decide caterer & 2 to 3 Jamanvars layout (Optional round tables vs buffet)', 
    category: 'catering', 
    assignedTo: 'Family', 
    side: 'Both',
    monthId: 'dec-2026', 
    dueDate: '2026-12-05',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: jamanvar = 2 or 3 -> caters nu round table (Optional).'
  },
  { 
    id: 't-dec-7', 
    title: 'Book generator on rent from Dhaval\'s contact for farm sound & lighting backup', 
    category: 'rentals', 
    assignedTo: 'Groom', 
    side: 'Boy',
    monthId: 'dec-2026', 
    dueDate: '2026-12-10',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: DJ - generater, Get generator contact from dhaval, available on rent.'
  },
  { 
    id: 't-dec-3', 
    title: 'Arrange welcome drinks for guest arrival & nasta/snacks for Garba night', 
    category: 'catering', 
    assignedTo: 'Family', 
    side: 'Both',
    monthId: 'dec-2026', 
    dueDate: '2026-12-15',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: welcome drink, nasta = garba night.'
  },
  { 
    id: 't-dec-2', 
    title: 'Hire dedicated "Pani valo" (water distributor for hot daytime vidhis)', 
    category: 'catering', 
    assignedTo: 'Family', 
    side: 'Both',
    monthId: 'dec-2026', 
    dueDate: '2026-12-20',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Food: pani valo.'
  },
  { 
    id: 't-dec-6', 
    title: 'Confirm food servers (pirsava vala) and dish cleaners (vasan utkva vala)', 
    category: 'catering', 
    assignedTo: 'Family', 
    side: 'Both',
    monthId: 'dec-2026', 
    dueDate: '2026-12-24',
    completed: false, 
    priority: 'medium',
    notes: 'Direct from user notes: pirsava vala, vasan utkva vala.'
  },
  { 
    id: 't-dec-4', 
    title: 'Hire farm saf-safai crew for ongoing cleanliness at Silver Farm', 
    category: 'venue', 
    assignedTo: 'Family', 
    side: 'Both',
    monthId: 'dec-2026', 
    dueDate: '2026-12-28',
    completed: false, 
    priority: 'medium',
    notes: 'Direct from user notes: Place: Farm, saf safai loko.'
  },
  { 
    id: 't-dec-5', 
    title: 'Hire 2 gate watchmen for farm parking & security', 
    category: 'venue', 
    assignedTo: 'Family', 
    side: 'Both',
    monthId: 'dec-2026', 
    dueDate: '2026-12-30',
    completed: false, 
    priority: 'medium',
    notes: 'Direct from user notes: Place: Farm, watchmen.'
  },

  // January 2027 (Rituals Preparation & Protocol Checks)
  { 
    id: 't-jan-1', 
    title: 'Prepare Chab Devani gift baskets (both sides exchange after Mandvo on Feb 20)', 
    category: 'rituals', 
    assignedTo: 'Both', 
    side: 'Both',
    monthId: 'jan-2027', 
    dueDate: '2027-01-08',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: mando pate pachi eni chab devani hoi, bei side ek bija ne dei de.'
  },
  { 
    id: 't-jan-2', 
    title: 'Prepare Paat Utraman cash envelopes & setup boy and girl mandvo seating', 
    category: 'rituals', 
    assignedTo: 'Family', 
    side: 'Both',
    monthId: 'jan-2027', 
    dueDate: '2027-01-14',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: mandvo pate pachi paat utraman karvanu hoi, badha cover deva ave.'
  },
  { 
    id: 't-jan-3', 
    title: 'Confirm late-night Garba ice cream arrangement (joint counter or separate for each side)', 
    category: 'catering', 
    assignedTo: 'Both', 
    side: 'Both',
    monthId: 'jan-2027', 
    dueDate: '2027-01-24',
    completed: false, 
    priority: 'medium',
    notes: 'Direct from user notes: garba chelle icream hoi, garba bhega hoi to bhega, nakar pot potani tya icream.'
  },
  { 
    id: 't-jan-4', 
    title: 'Review 10:00 PM Surat police sound cutoff rule with Dhaval\'s sound operator (close at 10 PM if police arrives, else till 12 AM)', 
    category: 'sound_dj', 
    assignedTo: 'Both', 
    side: 'Both',
    monthId: 'jan-2027', 
    dueDate: '2027-01-28',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Close at 10 if police comes else till 12 AM.'
  },
  { 
    id: 't-jan-5', 
    title: 'Police Station Visit for DJ Sound Permit (Low Decibel)', 
    category: 'sound_dj', 
    assignedTo: 'Both', 
    side: 'Both',
    monthId: 'jan-2027', 
    completed: false, 
    priority: 'high',
    dueDate: '2027-01-20',
    notes: 'Visit local police station on 20 January 2027 (11:00 AM) with marriage invitation card, Silver Farm venue booking receipt & Dhaval sound specs to secure official written permit for low-decibel DJ music during Feb 20 Raas Garba celebration.',
    subtasks: [
      { id: 'sub-ps-1', title: 'Bring marriage invitation card & venue booking slip', completed: false },
      { id: 'sub-ps-2', title: 'Get sound wattage & speaker specs from Dhaval sound operator', completed: false },
      { id: 'sub-ps-3', title: 'Submit application & collect official signed permit copy', completed: false }
    ],
    tags: ['Permit', 'DJ Sound', 'Police Station', 'Garba']
  },

  // February 1 - 14, 2027 (Final Prep & Fittings)
  { 
    id: 't-feb-1', 
    title: 'Final outfit fittings: Groom (Kurtas, Coty, Jodhpuri, Suits) & Bride (Chaniya Choli, Sarees)', 
    category: 'outfits', 
    assignedTo: 'Both', 
    side: 'Both',
    monthId: 'feb-prep', 
    dueDate: '2027-02-05',
    completed: false, 
    priority: 'high',
    notes: 'Ensure all tailoring adjustments are completed before wedding week.'
  },
  { 
    id: 't-feb-4', 
    title: 'Coordinate Joint Jamanvar (Dinner together on Feb 20, 6:00 - 6:30 PM)', 
    category: 'catering', 
    assignedTo: 'Family', 
    side: 'Both',
    monthId: 'feb-prep', 
    dueDate: '2027-02-08',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: jamanvar (boy and girl nu hare che 6-6:30 PM).'
  },
  { 
    id: 't-feb-2', 
    title: 'Confirm ICER truck assembly for 4:00 PM afternoon Jaan departure to Katargam (Feb 21)', 
    category: 'rentals', 
    assignedTo: 'Groom', 
    side: 'Boy',
    monthId: 'feb-prep', 
    dueDate: '2027-02-11',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Boy ne Bapor pachi jan leine javanu 4 wage, katargam farm thi one km away.'
  },
  { 
    id: 't-feb-3', 
    title: 'Girl side: Gor Maharaj finalized Lagan Lakhan date (Feb 15, 2027)', 
    category: 'rituals', 
    assignedTo: 'Bride', 
    side: 'Girl',
    monthId: 'feb-prep', 
    dueDate: '2027-02-14',
    completed: true, 
    priority: 'high',
    notes: 'FINALIZED: Gor Maharaj confirmed Lagan Lakhan & Haldi on Feb 15, 2027!'
  },

  // February 15 - 21, 2027 (Wedding Execution Days)
  { 
    id: 't-day-1', 
    title: 'Feb 15 08:00 AM: Randel Tedva at Groom home & welcome ~100 family guests', 
    category: 'rituals', 
    assignedTo: 'Family', 
    side: 'Boy',
    monthId: 'feb-days', 
    dueDate: '2027-02-15',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Sawar ma ran dal tedvana boy na ghare, Randel tedvanu: 8 AM. Finalized for Feb 15.'
  },
  { 
    id: 't-day-2', 
    title: 'Feb 15 10:00 AM: Gor Maharaj completes Lagan Lakhan at Bride house', 
    category: 'rituals', 
    assignedTo: 'Bride', 
    side: 'Girl',
    monthId: 'feb-days', 
    dueDate: '2027-02-15',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Gor maharaj girl na ghare lagan lakhavanu patave around 10-11 AM on Feb 15.'
  },
  { 
    id: 't-day-3', 
    title: 'Feb 15 11:00 AM: Bride brothers (5-6 people) deliver Lagan to Groom home; give shagun covers', 
    category: 'rituals', 
    assignedTo: 'Both', 
    side: 'Both',
    monthId: 'feb-days', 
    dueDate: '2027-02-15',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: pachi Lagan laine ave girl wala (pn girl nai, emna brothers) (5-6 people saman leine, boy side around 100 present hoi).'
  },
  { 
    id: 't-day-4', 
    title: 'Feb 15 12:00 PM: Boy side Jamanvar lunch (~100 guests)', 
    category: 'catering', 
    assignedTo: 'Family', 
    side: 'Boy',
    monthId: 'feb-days', 
    dueDate: '2027-02-15',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Boy ne emna meman ne jamadvana 12-1 PM.'
  },
  { 
    id: 't-day-5', 
    title: 'Feb 15 04:00 PM: Haldi Rasam at Groom home (guests invited for 4 PM)', 
    category: 'rituals', 
    assignedTo: 'Groom', 
    side: 'Boy',
    monthId: 'feb-days', 
    dueDate: '2027-02-15',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Haldi Rasam : 4 Wage, meman ne 4 wage bolavana. Finalized for Feb 15.'
  },
  { 
    id: 't-day-6', 
    title: 'Feb 15 06:00 PM: Evening Jamanvar (Dinner for guests, Bride side has more guests)', 
    category: 'catering', 
    assignedTo: 'Family', 
    side: 'Both',
    monthId: 'feb-days', 
    dueDate: '2027-02-15',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Sanj Jamanvar : 6-7 Wage, girl side tyre meman pn vadhare hase.'
  },
  { 
    id: 't-day-16', 
    title: 'Feb 16 08:00 AM: Randal Tedva at Girl\'s house (8:00 - 9:00 AM, Girl side)', 
    category: 'rituals', 
    assignedTo: 'Bride', 
    side: 'Girl',
    monthId: 'feb-days', 
    dueDate: '2027-02-16',
    completed: false, 
    priority: 'high',
    notes: 'Auspicious Randal Tedva function at girl\'s house around 8-9 AM on 16th Feb 2027.'
  },
  { 
    id: 't-day-17', 
    title: 'Feb 17 04:00 PM: Vana Rasam at Girl\'s place (Groom called for rasam together & couple photoshoot)', 
    category: 'rituals', 
    assignedTo: 'Both', 
    side: 'Both',
    monthId: 'feb-days', 
    dueDate: '2027-02-17',
    completed: false, 
    priority: 'high',
    notes: 'Vana Rasam on 17th Feb at girl\'s place: boy is called for the rasam together and photosession.'
  },
  { 
    id: 't-day-18', 
    title: 'Feb 18 04:00 PM: Mehndi at Girl\'s place (Groom called for couple photosession)', 
    category: 'rituals', 
    assignedTo: 'Both', 
    side: 'Both',
    monthId: 'feb-days', 
    dueDate: '2027-02-18',
    completed: false, 
    priority: 'high',
    notes: 'Mehndi at girl\'s place on 18th Feb: boy will be called upon for photoshoot.'
  },
  { 
    id: 't-day-19a', 
    title: 'Feb 19 11:00 AM: Mameru Ceremony at Girl\'s house (Girl side only with Mama family)', 
    category: 'rituals', 
    assignedTo: 'Bride', 
    side: 'Girl',
    monthId: 'feb-days', 
    dueDate: '2027-02-19',
    completed: false, 
    priority: 'high',
    notes: 'Mameru on 19th Feb: only girl\'s side function with maternal uncle & family.'
  },
  { 
    id: 't-day-19b', 
    title: 'Feb 19 04:30 PM: Chab Giving by Boy\'s side (Boy side presents Chab items to Girl\'s side)', 
    category: 'rituals', 
    assignedTo: 'Both', 
    side: 'Both',
    monthId: 'feb-days', 
    dueDate: '2027-02-19',
    completed: false, 
    priority: 'high',
    notes: 'Boy\'s side is called on 19th Feb to present and give Chab gift items to girl\'s side.'
  },
  { 
    id: 't-day-19c', 
    title: 'Feb 19 09:00 PM: Sanji Na Geet at Girl\'s house (Girl side guests only)', 
    category: 'rituals', 
    assignedTo: 'Bride', 
    side: 'Girl',
    monthId: 'feb-days', 
    dueDate: '2027-02-19',
    completed: false, 
    priority: 'high',
    notes: 'Sanji na geet around 9:00 PM on 19th Feb with girl side guests only.'
  },
  { 
    id: 't-day-7-boy', 
    title: 'Feb 20 09:00 AM: Groom Grooming & Makeup Prep (9:00 AM – 11:00 AM, Boy side)', 
    category: 'outfits', 
    assignedTo: 'Groom', 
    side: 'Boy',
    monthId: 'feb-days', 
    dueDate: '2027-02-20',
    completed: false, 
    priority: 'high',
    notes: 'Boy makeup, hair styling, beard grooming, and Mandvo outfit readyness between 9:00 AM – 11:00 AM.'
  },
  { 
    id: 't-day-7', 
    title: 'Feb 20 11:00 AM: Bride Parlour slot starts strictly between 11 AM - 12 PM', 
    category: 'outfits', 
    assignedTo: 'Bride', 
    side: 'Girl',
    monthId: 'feb-days', 
    dueDate: '2027-02-20',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: 20 th Feb Parlour : 11 AM or 12 PM.'
  },
  { 
    id: 't-day-8', 
    title: 'Feb 20 02:00 PM: Mandvo Vidhi (Ganpati & Brahman puja, 2 hrs in dome) + Ek bija na mandvo + Chandlo', 
    category: 'rituals', 
    assignedTo: 'Family', 
    side: 'Both',
    monthId: 'feb-days', 
    dueDate: '2027-02-20',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Mandvo - 2 PM (from boys side, need to ask girl’s side). ek bija na mandvo nakhshe, pachi boy ne chandlo karva ave.'
  },
  { 
    id: 't-day-9', 
    title: 'Feb 20 06:00 PM: JOINT JAMANVAR (Boy & Girl side families dine together 6:00 - 6:30 PM)', 
    category: 'catering', 
    assignedTo: 'Family', 
    side: 'Both',
    monthId: 'feb-days', 
    dueDate: '2027-02-20',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: jamanvar (boy and girl nu hare che 6-6:30 PM).'
  },
  { 
    id: 't-day-10', 
    title: 'Feb 20 08:00 PM: Raas Garba starts (Dhaval 6x6 DJ; close at 10 PM if police arrives, else till 12 AM)', 
    category: 'sound_dj', 
    assignedTo: 'Both', 
    side: 'Both',
    monthId: 'feb-days', 
    dueDate: '2027-02-20',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Garba - 8 PM, Close at 10 if police comes else till 12 AM.'
  },
  { 
    id: 't-day-11', 
    title: 'Feb 21 04:00 PM: Boy side leaves with Jaan in afternoon to Katargam (1 km from farm)', 
    category: 'logistics', 
    assignedTo: 'Groom', 
    side: 'Boy',
    monthId: 'feb-days', 
    dueDate: '2027-02-21',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Boy ne Bapor pachi jan leine javanu 4 wage, katargam farm thi one km away.'
  },
  { 
    id: 't-day-12', 
    title: 'Feb 21 Evening: Entry event at Katargam venue, Mandap ma besi javanu & Varmala', 
    category: 'rituals', 
    assignedTo: 'Both', 
    side: 'Both',
    monthId: 'feb-days', 
    dueDate: '2027-02-21',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Entry event, Mandap ma besi javanu.'
  },
  { 
    id: 't-day-13', 
    title: 'Feb 21 12:00 AM Midnight: Lagan vidhi completes around 12 AM -> Visit temple (Mandir) together', 
    category: 'rituals', 
    assignedTo: 'Both', 
    side: 'Both',
    monthId: 'feb-days', 
    dueDate: '2027-02-21',
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Lagan thay jay 12 wage etle ek mandir e jay avanu.'
  }
];


export const INITIAL_RENTALS: RentalItem[] = [
  {
    id: 'rent-1',
    item: 'Heavy Silent Generator (Farm Backup)',
    vendor: 'Generator Vendor (via Dhaval referral)',
    contactPerson: 'Dhaval contact',
    phone: 'To get from Dhaval',
    pickupDate: '2027-02-20',
    pickupTime: '08:00 AM',
    dropDate: '2027-02-21',
    dropTime: '05:00 PM',
    pickupLocation: 'Delivered to Silver Farm directly',
    totalCost: 0,
    advancePaid: 0,
    securityDeposit: 0,
    status: 'To Book',
    side: 'Boy',
    notes: 'Direct from user notes: DJ - generater, Get generator contact from dhaval, available on rent.'
  },
  {
    id: 'rent-2',
    item: 'Garba Night Sound Rig (6 Base, 6 Top, 16 LED, 6 Safi, 40ft C-Truss, 4 Battle Top)',
    vendor: 'Dhaval Jajenwala',
    contactPerson: 'Dhaval Jajenwala',
    phone: 'Direct contact',
    pickupDate: '2027-02-20',
    pickupTime: '02:00 PM',
    dropDate: '2027-02-21',
    dropTime: '02:00 AM',
    pickupLocation: 'Silver Farm Main Ground',
    totalCost: 24000,
    advancePaid: 0,
    securityDeposit: 0,
    status: 'Reserved',
    side: 'Both',
    notes: 'Direct from user notes: Sangit 24,000, 6 base 6 top, 16 led, 6 safi, 4 battle top, 1 sound + 1 light operator, 40ft C-truss. Close at 10 PM if police comes, else till 12 AM!'
  },
  {
    id: 'rent-3',
    item: 'ICER Truck for 4 PM Jaan (4 Base 4 Top + C-Truss & Floral Decor)',
    vendor: 'ICER Transport & Sound (via Dhaval)',
    contactPerson: 'Truck Operator',
    phone: 'To confirm',
    pickupDate: '2027-02-21',
    pickupTime: '02:30 PM (for mounting)',
    dropDate: '2027-02-21',
    dropTime: '10:00 PM',
    pickupLocation: 'Groom Residence to Katargam',
    totalCost: 15000,
    advancePaid: 0,
    securityDeposit: 0,
    status: 'Reserved',
    side: 'Boy',
    notes: 'Direct from user notes: Jan Need icer, 4 base 4 top, sound operator, upper body 15k, C-truss & flowers. Jaan leaves at 4:00 PM afternoon to Katargam (1 km from farm)!'
  },
  {
    id: 'rent-4',
    item: 'Haldi Sound Rig (2 Base, 2 Top + 1 Operator)',
    vendor: 'Dhaval Jajenwala',
    contactPerson: 'Dhaval Jajenwala',
    pickupDate: '2027-02-15',
    pickupTime: '03:30 PM',
    dropDate: '2027-02-15',
    dropTime: '08:00 PM',
    pickupLocation: 'Groom Residence Courtyard',
    totalCost: 4000,
    advancePaid: 0,
    securityDeposit: 0,
    status: 'Reserved',
    side: 'Boy',
    notes: 'Direct from user notes: Haldi: 2 base 2 top. Rate 4000. One operator for sound. Haldi starts at 4 PM on Feb 15.'
  },
  {
    id: 'rent-5',
    item: 'Lagan Mandap Sound Rig (2 Base, 2 Top + 1 Operator)',
    vendor: 'Dhaval Jajenwala',
    contactPerson: 'Dhaval Jajenwala',
    pickupDate: '2027-02-21',
    pickupTime: '05:00 PM',
    dropDate: '2027-02-22',
    dropTime: '01:00 AM',
    pickupLocation: 'Katargam Mandap',
    totalCost: 4000,
    advancePaid: 0,
    securityDeposit: 0,
    status: 'Reserved',
    side: 'Both',
    notes: 'Direct from user notes: Lagan: 2 base 2 top. Rate 4000. One operator for sound (slow music / lagan geet) until Lagan finishes at 12 AM.'
  },
  {
    id: 'rent-6',
    item: 'Dining Round Tables & Linen (Optional from Caterers)',
    vendor: 'Caterer / Silver Farm',
    pickupDate: '2027-02-20',
    pickupTime: '11:00 AM',
    dropDate: '2027-02-21',
    dropTime: '05:00 PM',
    pickupLocation: 'Dining Area, Silver Farm',
    totalCost: 0,
    advancePaid: 0,
    securityDeposit: 0,
    status: 'To Book',
    side: 'Both',
    notes: 'Direct from user notes: jamanvar = 2 or 3 -> caters nu round table (Optional). Joint Jamanvar on Feb 20 from 6:00 - 6:30 PM!'
  },
  {
    id: 'rent-7',
    item: 'Farm Dome / Mandvo Construction',
    vendor: 'Silver Farm Decorator',
    pickupDate: '2027-02-19',
    pickupTime: '04:00 PM',
    dropDate: '2027-02-21',
    dropTime: '08:00 PM',
    pickupLocation: 'Silver Farm Mandvo Area',
    totalCost: 0,
    advancePaid: 0,
    securityDeposit: 0,
    status: 'To Book',
    side: 'Both',
    notes: 'Direct from user notes: dome ma karvanu dome hoi to nakar mandvo banavano hoi. 2 PM mandvo on Feb 20.'
  }
];


export const INITIAL_DRESSES: DressItem[] = [
  // Groom Outfits (Boy's Side)
  {
    id: 'dr-1',
    event: 'Randel & Lagan-Lakhan Arrival',
    date: 'Feb 15, 2027 Morning',
    person: 'Groom',
    garmentName: 'Traditional Cotton Kurta Pajama',
    colorTheme: 'Traditional auspicious',
    action: 'Buy',
    status: 'To Buy',
    costEstimated: 0,
    advancePaid: 0,
    notes: 'Direct from user notes: Sawar ma ran dal tedvana boy na ghare, 15 feb event.'
  },
  {
    id: 'dr-2',
    event: 'Varghodo & Geet Gunjan',
    date: 'Pre-Wedding Evening',
    person: 'Groom',
    garmentName: 'Jodhpuri Suit or Formal Blazer',
    colorTheme: 'Festive evening color',
    action: 'Tailor / Stitch',
    status: 'To Buy',
    costEstimated: 0,
    advancePaid: 0,
    notes: 'Direct from user notes: Sanje varghodo jodhpuri jevu ka to suit.'
  },
  {
    id: 'dr-3',
    event: 'Haldi Rasam (Groom\'s Side)',
    date: 'Feb 15, 2027 04:00 PM',
    person: 'Groom',
    garmentName: 'Haldi Kurta Pajama',
    colorTheme: 'Blue / White / Lavender theme',
    action: 'Buy',
    status: 'To Buy',
    costEstimated: 0,
    advancePaid: 0,
    notes: 'Direct from user notes: Haldi Rasam 4 Wage, kurta payjama, blue theme, white, lavender.'
  },
  {
    id: 'dr-3b',
    event: 'Vana Rasam & Couple Photosession',
    date: 'Feb 17, 2027 04:00 PM',
    person: 'Groom',
    garmentName: 'Traditional Kurta Pajama / Indo-Western',
    colorTheme: 'Festive ceremonial shade',
    action: 'Buy',
    status: 'To Buy',
    costEstimated: 0,
    advancePaid: 0,
    notes: 'Vana Rasam at Girl\'s place on Feb 17: boy is called for rasam together and photosession.'
  },
  {
    id: 'dr-3c',
    event: 'Mehndi Couple Photoshoot Visit',
    date: 'Feb 18, 2027 04:00 PM',
    person: 'Groom',
    garmentName: 'Kurta Pajama / Stylish Nehru Jacket',
    colorTheme: 'Matching mehndi aesthetic',
    action: 'Buy',
    status: 'To Buy',
    costEstimated: 0,
    advancePaid: 0,
    notes: 'Mehndi at girl\'s place on Feb 18: boy called upon with 1-2 friends for photoshoot.'
  },
  {
    id: 'dr-3d',
    event: 'Chab Giving by Boy\'s Side',
    date: 'Feb 19, 2027 04:30 PM',
    person: 'Groom',
    garmentName: 'Formal / Traditional Attire',
    colorTheme: 'Traditional formal',
    action: 'Tailor / Stitch',
    status: 'To Buy',
    costEstimated: 0,
    advancePaid: 0,
    notes: 'Boy\'s side presents and gifts decorated Chab hampers to Girl\'s side.'
  },
  {
    id: 'dr-4',
    event: 'Mandvo & Grah Shanti',
    date: 'Feb 20, 2027 02:00 PM',
    person: 'Groom',
    garmentName: 'Traditional Coty (Bandi) & Kurta',
    colorTheme: 'Traditional festive shade',
    action: 'Tailor / Stitch',
    status: 'To Buy',
    costEstimated: 0,
    advancePaid: 0,
    notes: 'Direct from user notes: Mandvo - 2 PM, Bapore ghrah shanti traditional coty.'
  },
  {
    id: 'dr-5',
    event: 'Joint Jamanvar & Raas Garba Night',
    date: 'Feb 20, 2027 06:00 PM / 08:00 PM',
    person: 'Groom',
    garmentName: 'Kurta Pajama OR Suit OR Shirt-Pant',
    colorTheme: 'Reception festive wear',
    action: 'Tailor / Stitch',
    status: 'To Buy',
    costEstimated: 0,
    advancePaid: 0,
    notes: 'Direct from user notes: Dj ma kurta pajama / 20 sanje shurt pent / Sanje reception suit.'
  },
  {
    id: 'dr-6',
    event: '4 PM Jaan Departure to Katargam & Lagan',
    date: 'Feb 21, 2027 04:00 PM to Midnight',
    person: 'Groom',
    garmentName: 'Lagan Wedding Suit',
    colorTheme: 'Classic wedding suit',
    action: 'Tailor / Stitch',
    status: 'To Buy',
    costEstimated: 0,
    advancePaid: 0,
    notes: 'Direct from user notes: 21 lagan ma suit, Boy leaves at 4 PM to Katargam!'
  },

  // Bride Outfits (Girl's Side)
  {
    id: 'dr-7',
    event: 'Lagan-Lakhan at Girl\'s Home',
    date: 'Feb 15, 2027 10:00 AM',
    person: 'Bride',
    garmentName: 'Traditional Ceremony Saree / Outfit',
    colorTheme: 'Traditional auspicious Bandhani',
    action: 'Buy',
    status: 'To Buy',
    costEstimated: 0,
    advancePaid: 0,
    notes: 'Direct from user notes: Gor maharaj girl na ghare lagan lakhavanu patave around 10-11 AM on Feb 15.'
  },
  {
    id: 'dr-7b',
    event: 'Randal Tedva at Girl\'s House',
    date: 'Feb 16, 2027 08:00 AM',
    person: 'Bride',
    garmentName: 'Auspicious Saree / Bandhani',
    colorTheme: 'Red / Auspicious Yellow / Green',
    action: 'Buy',
    status: 'To Buy',
    costEstimated: 0,
    advancePaid: 0,
    notes: 'Auspicious Randal Tedva at Bride\'s house on Feb 16 from 8:00 AM - 9:00 AM.'
  },
  {
    id: 'dr-7c',
    event: 'Vana Rasam & Couple Photosession',
    date: 'Feb 17, 2027 04:00 PM',
    person: 'Bride',
    garmentName: 'Vana Ceremony Traditional Saree',
    colorTheme: 'Ceremonial auspicious shade',
    action: 'Buy',
    status: 'To Buy',
    costEstimated: 0,
    advancePaid: 0,
    notes: 'Vana Rasam on Feb 17: Groom called for rasam together and couple photosession.'
  },
  {
    id: 'dr-8',
    event: 'Mehndi Rasam & Couple Photoshoot',
    date: 'Feb 18, 2027 04:00 PM',
    person: 'Bride',
    garmentName: 'Mehndi Outfit',
    colorTheme: 'Green / Festive bright',
    action: 'Buy',
    status: 'To Buy',
    costEstimated: 0,
    advancePaid: 0,
    notes: 'Direct from user notes: Mehndi at Girl\'s place on Feb 18; Groom called upon for photoshoot.'
  },
  {
    id: 'dr-9b',
    event: 'Mameru Ceremony',
    date: 'Feb 19, 2027 11:00 AM',
    person: 'Bride',
    garmentName: 'Mameru Auspicious Saree / Silk',
    colorTheme: 'Traditional Mameru shade (gifted by Mama)',
    action: 'Buy',
    status: 'To Buy',
    costEstimated: 0,
    advancePaid: 0,
    notes: 'Feb 19 Mameru ceremony: Girl side function only with maternal uncle Mama & family.'
  },
  {
    id: 'dr-9c',
    event: 'Sanji Na Geet Night',
    date: 'Feb 19, 2027 09:00 PM',
    person: 'Bride',
    garmentName: 'Festive Saree / Lehenga',
    colorTheme: 'Evening festive',
    action: 'Buy',
    status: 'To Buy',
    costEstimated: 0,
    advancePaid: 0,
    notes: 'Feb 19 Sanji na geet at Girl\'s house around 9:00 PM with girl side guests only.'
  },
  {
    id: 'dr-10',
    event: 'Mandvo & Chandlo Karva Aavu',
    date: 'Feb 20, 2027 02:00 PM',
    person: 'Bride',
    garmentName: 'Mandvo Traditional Wear',
    colorTheme: 'Traditional Gharchola / Silk',
    action: 'Buy',
    status: 'To Buy',
    costEstimated: 0,
    advancePaid: 0,
    notes: 'Direct from user notes: pachi boy ne chandlo karva ave, mando pate pachi chab devani.'
  },
  {
    id: 'dr-11',
    event: 'Raas Garba (Peer Side to Silver Farm Entry)',
    date: 'Feb 20, 2027 08:00 PM',
    person: 'Bride',
    garmentName: 'Chaniya Choli (Peer side to Silver Farm)',
    colorTheme: 'Navratri craft / Mirror-work',
    action: 'Buy',
    status: 'To Buy',
    costEstimated: 0,
    advancePaid: 0,
    notes: 'Direct from user notes: girl half time garba ena peer ma karine ave, ras mate girl ne lei avine entry karava.'
  },
  {
    id: 'dr-12',
    event: 'Lagan Ceremony & Phere at Katargam',
    date: 'Feb 21, 2027 06:30 PM to Midnight',
    person: 'Bride',
    garmentName: 'Bridal Panetar / Wedding Saree',
    colorTheme: 'Traditional Red & White Panetar',
    action: 'Buy',
    status: 'To Buy',
    costEstimated: 0,
    advancePaid: 0,
    notes: 'Direct from user notes: Mandap ma besi javanu, lagan thay jay 12 wage etle mandir e jay avanu.'
  }
];


export const INITIAL_DAY_SCHEDULES: EventDaySchedule[] = [
  {
    id: 'feb-15',
    dateString: '2027-02-15',
    dayName: 'Monday / 15 Feb',
    title: 'Lagan Lakhan, Haldi & Home Rituals',
    location: 'Groom & Bride Respective Homes',
    items: [
      {
        id: 's-15-1',
        time: '08:00 AM',
        title: 'Randel Tedva (Groom Home)',
        gujaratiTitle: 'સવારમાં રાંદલ તેડવા (છોકરાના ઘરે - ૮ વાગે)',
        location: 'Groom Residence',
        actionNotes: 'Auspicious Randel sthapana and invocation at Groom\'s residence in the morning.',
        side: 'Boy',
        outfitGroom: 'Traditional Cotton Kurta'
      },
      {
        id: 's-15-2',
        time: '10:00 AM – 11:00 AM',
        title: 'Lagan Lakhavanu (Bride Home with Gor Maharaj)',
        gujaratiTitle: 'લગ્ન લખાણ (દીકરીના ઘરે ગોર મહારાજ સાથે - ૧૦ થી ૧૧ વાગે)',
        location: 'Bride Residence',
        actionNotes: 'Gor Maharaj completes auspicious Lagan Lakhan writing rituals at Bride\'s house.',
        side: 'Girl',
        outfitBride: 'Traditional Bandhani'
      },
      {
        id: 's-15-3',
        time: '11:00 AM – 12:00 PM',
        title: 'Lagan Delivery to Groom Home (Bride\'s Brothers)',
        gujaratiTitle: 'લગ્ન લઈને આવવું (દીકરીના ભાઈઓ ૫-૬ જણા સામાન લઈને આવે, છોકરા પક્ષે ~૧૦૦ હાજર)',
        location: 'Groom Residence',
        actionNotes: '5 to 6 brothers of Bride arrive carrying Lagan patrika and ritual saman. Around 100 boy side relatives present. Give shagun covers and hospitality to brothers before they return.',
        side: 'Both'
      },
      {
        id: 's-15-4',
        time: '12:00 PM – 01:00 PM',
        title: 'Boy Side Lunch Feast (Jamanvar)',
        gujaratiTitle: 'બપોરે જમણવાર (૧૨ થી ૧ વાગે - ૧૦૦ મહેમાન)',
        location: 'Groom Residence Dining',
        actionNotes: 'Celebratory feast served to ~100 family members and guests at Groom\'s home.',
        side: 'Boy'
      },
      {
        id: 's-15-5',
        time: '04:00 PM',
        title: 'Haldi Rasam (Groom\'s Side)',
        gujaratiTitle: 'હળદી રસમ (૪ વાગે મહેમાનોને બોલાવવા)',
        location: 'Groom Residence Courtyard',
        actionNotes: 'Guests invited for 4:00 PM. Festive Haldi and Pithi ceremony for Groom.',
        side: 'Boy',
        outfitGroom: 'Haldi Kurta Pajama (Blue/White/Lavender)',
        soundRig: '2 Base, 2 Top sound setup'
      },
      {
        id: 's-15-6',
        time: '06:00 PM – 07:00 PM',
        title: 'Evening Jamanvar (Dinner for Both Sides)',
        gujaratiTitle: 'સાંજનો જમણવાર (૬ થી ૭ વાગે - દીકરી પક્ષે મહેમાન વધારે હશે)',
        location: 'Respective Family Venues',
        actionNotes: 'Evening dinner feast for guests. Bride\'s side has a larger guest gathering this evening.',
        side: 'Both'
      }
    ]
  },
  {
    id: 'feb-16',
    dateString: '2027-02-16',
    dayName: 'Tuesday / 16 Feb',
    title: 'Randal Tedva at Girl\'s House',
    location: 'Bride Residence',
    items: [
      {
        id: 's-16-1',
        time: '08:00 AM – 09:00 AM',
        title: 'Randal Tedva (Girl\'s House)',
        gujaratiTitle: 'રાંદલ તેડવા (દીકરીના ઘરે - સવારે ૮ થી ૯ વાગે)',
        location: 'Bride Residence',
        actionNotes: 'Auspicious Randal sthapana and invocation ceremony at Bride\'s residence in the morning (8:00–9:00 AM) with girl side family and relatives.',
        side: 'Girl',
        outfitBride: 'Auspicious Saree / Bandhani',
        urgentRule: 'Randal Tedva at Girl\'s house scheduled for 8:00 AM – 9:00 AM!'
      }
    ]
  },
  {
    id: 'feb-17',
    dateString: '2027-02-17',
    dayName: 'Wednesday / 17 Feb',
    title: 'Vana Rasam & Couple Photosession',
    location: 'Bride Residence',
    items: [
      {
        id: 's-17-1',
        time: '04:00 PM – 06:30 PM',
        title: 'Vana Rasam & Couple Photosession',
        gujaratiTitle: 'વાણા રસમ અને ફોટોસેશન (દીકરીના ઘરે - છોકરાને સાથે રસમ અને ફોટા માટે બોલાવવો)',
        location: 'Bride Residence',
        actionNotes: 'Traditional Vana Rasam celebrated at Girl\'s place. Groom is called upon to participate in the sacred rasam together with the Bride, followed by a dedicated couple photoshoot.',
        side: 'Both',
        outfitGroom: 'Traditional Kurta Pajama',
        outfitBride: 'Ceremony Attire / Saree',
        urgentRule: 'Groom is invited to Girl\'s place for Vana Rasam together & couple photoshoot!'
      }
    ]
  },
  {
    id: 'feb-18',
    dateString: '2027-02-18',
    dayName: 'Thursday / 18 Feb',
    title: 'Mehndi Rasam at Girl\'s House',
    location: 'Bride Residence / Lawn',
    items: [
      {
        id: 's-18-1',
        time: '04:00 PM – 07:30 PM',
        title: 'Mehndi Rasam & Groom Photosession',
        gujaratiTitle: 'મહેંદી રસમ અને કપલ ફોટોસેશન (દીકરીના ઘરે - છોકરાને ફોટા માટે બોલાવવો)',
        location: 'Bride Residence / Lawn',
        actionNotes: 'Festive Mehndi celebration held at Girl\'s place. Groom is called upon with 1-2 close friends for a couple photoshoot with the Bride in her mehndi outfit.',
        side: 'Both',
        outfitBride: 'Green / Festive Mehndi Outfit',
        outfitGroom: 'Kurta Pajama / Indo-Western',
        urgentRule: 'Groom invited to Girl\'s place for couple photoshoot during Mehndi!'
      }
    ]
  },
  {
    id: 'feb-19',
    dateString: '2027-02-19',
    dayName: 'Friday / 19 Feb',
    title: 'Mameru, Chab Giving & Sanji Na Geet',
    location: 'Bride Residence',
    items: [
      {
        id: 's-19-1',
        time: '11:00 AM – 01:30 PM',
        title: 'Mameru Ceremony (Girl\'s Side Only)',
        gujaratiTitle: 'મામેરું (દીકરીના ઘરે - ફક્ત દીકરી પક્ષનો પ્રસંગ, મામા પક્ષ તરફથી શુકન)',
        location: 'Bride Residence',
        actionNotes: 'Traditional Mameru ceremony hosted exclusively by Bride\'s maternal uncle (Mama) and maternal relatives with auspicious gifts, clothes, and jewellery. Strictly girl\'s side function.',
        side: 'Girl',
        outfitBride: 'Mameru Traditional Saree'
      },
      {
        id: 's-19-2',
        time: '04:30 PM – 06:00 PM',
        title: 'Chab Giving by Boy\'s Side',
        gujaratiTitle: 'છાબ આપવી (છોકરા પક્ષ દ્વારા દીકરીના ઘરે છાબ-સામાન આપવો)',
        location: 'Bride Residence',
        actionNotes: 'Groom\'s family is invited to present and gift the auspicious \'Chab\' (decorated gift hampers containing wedding clothes, cosmetics, dry fruits, sweets, and ceremonial items) to the Bride\'s family.',
        side: 'Both',
        outfitGroom: 'Formal / Traditional Attire',
        urgentRule: 'Boy\'s side presents and gifts Chab items to Girl\'s family!'
      },
      {
        id: 's-19-3',
        time: '09:00 PM – 11:30 PM',
        title: 'Sanji Na Geet (Girl\'s Side Guests Only)',
        gujaratiTitle: 'સાંજીના ગીત (રાત્રે ૯ વાગે - ફક્ત દીકરી પક્ષના મહેમાનો સાથે)',
        location: 'Bride Residence',
        actionNotes: 'Around 9:00 PM, Girl\'s side hosts traditional Gujarati wedding song night (Sanji na geet / Fatana) celebrating with family, women, and girl\'s side guests only.',
        side: 'Girl',
        urgentRule: 'Sanji na geet starts at 9:00 PM at Girl\'s house with girl side guests only!'
      }
    ]
  },
  {
    id: 'feb-20',
    dateString: '2027-02-20',
    dayName: 'Saturday / 20 Feb',
    title: 'Mandvo, Joint Dinner & Raas Garba',
    location: 'Silver Farm, Surat',
    items: [
      {
        id: 's-20-0',
        time: '09:00 AM – 11:00 AM',
        title: 'Groom Makeup & Readiness Prep (Boy Side)',
        gujaratiTitle: 'વરરાજા તૈયાર થવું અને મેકઅપ (સવારે ૯ થી ૧૧ વાગે)',
        location: 'Groom Residence / Salon',
        actionNotes: 'Groom gets ready with hair styling, beard grooming, makeup, and Mandvo outfit (Coty & Kurta) draping between 9:00 AM – 11:00 AM before afternoon rituals.',
        side: 'Boy',
        outfitGroom: 'Traditional Coty (Bandi) & Kurta',
        urgentRule: 'Groom makeup & prep slot scheduled strictly for 9:00 AM – 11:00 AM!'
      },
      {
        id: 's-20-1',
        time: '11:00 AM – 12:00 PM',
        title: 'Bridal Parlour Prep (Bride Side)',
        gujaratiTitle: 'પાર્લર તૈયારી (સવારે ૧૧ થી ૧૨ વાગે શરૂ)',
        location: 'Bridal Parlour',
        actionNotes: 'Bride arrives at parlour for hair, draping, and makeup prep. Starts between 11 AM – 12 PM so ready in time for afternoon mandvo.',
        side: 'Girl',
        urgentRule: 'Parlour slot confirmed for 11 AM - 12 PM start!'
      },
      {
        id: 's-20-2',
        time: '02:00 PM',
        title: 'Mandvo Vidhi (Ganpati & Brahman Puja)',
        gujaratiTitle: 'માંડવો (બપોરે ૨ વાગે - ગણપતિ અને બ્રાહ્મણ વિધિ ૨ કલાક)',
        location: 'Silver Farm Dome (or Mandap)',
        actionNotes: '2 hours auspicious Mandvo ceremony from Boy\'s side (re-confirm Girl\'s side mandvo timing). Held in dome if available, otherwise mandap.',
        side: 'Both',
        soundRig: 'Soft traditional background music',
        outfitGroom: 'Traditional Coty (Bandi) & Kurta'
      },
      {
        id: 's-20-3',
        time: '03:30 PM',
        title: 'Ek Bija Na Mandvo Nakhshe & Chab Devani',
        gujaratiTitle: 'એકબીજાના માંડવા નાખવા અને છાબ દેવી',
        location: 'Mandvo Area',
        actionNotes: 'During mandvo, both sides symbolically place mandvo for each other and exchange Chab gift baskets.',
        side: 'Both'
      },
      {
        id: 's-20-4',
        time: '04:30 PM',
        title: 'Boy Ne Chandlo Karva Aavu & Paat Utraman',
        gujaratiTitle: 'છોકરાને ચાંદલો કરવા આવવું અને પાટ ઉતરામણ',
        location: 'Mandvo Platform',
        actionNotes: 'Girl side family arrives to do Chandlo for Groom. Relatives gather to give shagun envelopes.',
        side: 'Both'
      },
      {
        id: 's-20-5',
        time: '06:00 PM – 06:30 PM',
        title: 'JOINT JAMANVAR (Boy & Girl Sides Dine Together)',
        gujaratiTitle: 'ભેગો જમણવાર (છોકરા અને દીકરી પક્ષનો સાથે જમણવાર - સાંજે ૬ થી ૬:૩૦)',
        location: 'Silver Farm Dining Area',
        actionNotes: 'Grand dinner served together for both Boy\'s and Girl\'s side families and relatives at Silver Farm round tables!',
        side: 'Both',
        urgentRule: 'Both families dine together between 6:00 - 6:30 PM before Garba!'
      },
      {
        id: 's-20-6',
        time: '08:00 PM',
        title: 'Raas Garba Night (Dhaval Jajenwala 6×6 DJ Rig)',
        gujaratiTitle: 'રાસ ગરબા (રાત્રે ૮ વાગે - ૬ બેઝ ૬ ટોપ DJ)',
        location: 'Silver Farm Main Ground',
        actionNotes: 'High-energy Raas Garba starts with 6 Base, 6 Top, 16 LEDs, 6 Safi floodlights, 40ft C-truss.',
        side: 'Both',
        soundRig: 'Dhaval Jajenwala 6B+6T, 16 LED, 6 Safi, 40ft C-truss (₹24,000)'
      },
      {
        id: 's-20-7',
        time: '09:15 PM',
        title: 'Grand Couple Entry & Bride Arrival',
        gujaratiTitle: 'કપલ એન્ટ્રી (દીકરી પિયરમાં અડધો સમય ગરબા કરીને એન્ટ્રી કરે)',
        location: 'Main Garba Ground',
        actionNotes: 'Bride arrives after doing half-time garba at peer side. Grand couple entry with spotlight truss.',
        side: 'Both'
      },
      {
        id: 's-20-8',
        time: '10:00 PM – 12:00 AM',
        title: 'Police Sound Cutoff Rule / Late Garba',
        gujaratiTitle: '૧૦ વાગે જો પોલીસ આવે તો બંધ/ધીમું, નહીંતર રાત્રે ૧૨ વાગ્યા સુધી ગરબા!',
        location: 'DJ Console',
        actionNotes: 'If police comes, close high DJ sound at 10 PM. Otherwise, continue garba till 12:00 AM midnight!',
        side: 'Both',
        urgentRule: 'Close high DJ at 10 PM if police comes, else continue till 12:00 AM!'
      },
      {
        id: 's-20-9',
        time: '11:30 PM',
        title: 'Late Night Ice Cream Service',
        gujaratiTitle: 'ગરબા છેલ્લે આઈસક્રીમ',
        location: 'Catering Counter',
        actionNotes: 'Ice cream counter served to all guests before wrapping up and heading home.',
        side: 'Both'
      }
    ]
  },
  {
    id: 'feb-21',
    dateString: '2027-02-21',
    dayName: 'Sunday / 21 Feb',
    title: 'Afternoon Jaan to Katargam, Lagan & Mandir',
    location: 'Katargam Marriage Farm Venue',
    items: [
      {
        id: 's-21-parlour',
        time: '08:00 AM – 10:00 AM',
        title: 'Bride & Groom Parlour Prep (Get Ready)',
        gujaratiTitle: 'વર-વધૂ પાર્લરમાં તૈયાર થવું (સવારે ૮ થી ૧૦ વાગે)',
        location: 'Respective Bridal / Groom Parlours',
        actionNotes: 'Bride and Groom arrive early at their respective parlours for hair styling, makeup, draping, and wedding attire readiness.',
        side: 'Both',
        outfitGroom: 'Lagan Wedding Suit',
        outfitBride: 'Bridal Panetar / Wedding Saree',
        urgentRule: 'Parlour prep strictly from 8:00 AM – 10:00 AM so photography starts on time!'
      },
      {
        id: 's-21-photo',
        time: '10:00 AM – 12:00 PM',
        title: 'Wedding Photography & Couple Portraits',
        gujaratiTitle: 'ફોટોશૂટ અને કપલ પોટ્રેટ્સ (સવારે ૧૦ થી ૧૨ વાગે)',
        location: 'Photo Studio / Scenic Venue',
        actionNotes: 'Dedicated wedding day couple photo session, solo bridal portraits, groom portraits, and creative cinematography shots.',
        side: 'Both',
        urgentRule: 'Dedicated 2-hour photography session before lunch!'
      },
      {
        id: 's-21-lunch',
        time: '01:00 PM – 02:00 PM',
        title: 'Lunch (At Own House or Together as Couple)',
        gujaratiTitle: 'બપોરનું જમણવાર (પોતાના ઘરે અથવા કપલ સાથે - ૧ થી ૨ વાગે)',
        location: 'Respective Family Homes / Private Dining',
        actionNotes: 'Lunch break for the couple and families to rest, hydrate, and recharge before afternoon ceremonies.',
        side: 'Both'
      },
      {
        id: 's-21-touchup',
        time: '02:30 PM – 03:00 PM',
        title: 'Groom Touch-Up & Final Dressup (Boy Side)',
        gujaratiTitle: 'છોકરાનું ટચઅપ અને ફાઇનલ તૈયારી (બપોરે ૨:૩૦ થી ૩:૦૦)',
        location: 'Groom Residence',
        actionNotes: 'Groom final touch-up, hair set, safa/paghdi tying, and brooch attachment before home departure vidhi.',
        side: 'Boy',
        outfitGroom: 'Lagan Wedding Suit & Safa'
      },
      {
        id: 's-21-girl-touchup',
        time: '03:00 PM – 04:00 PM',
        title: 'Bride Makeup Touch-Up (Girl Side)',
        gujaratiTitle: 'દીકરીનું મેકઅપ ટચઅપ (બપોરે ૩:૦૦ થી ૪:૦૦ વાગે)',
        location: 'Bride Residence',
        actionNotes: 'Bride final makeup touch-up, hair setting, jewellery adjustments, and Panetar saree draping perfecting before leaving for venue.',
        side: 'Girl',
        outfitBride: 'Bridal Panetar / Wedding Saree'
      },
      {
        id: 's-21-homevidhi',
        time: '03:00 PM – 03:30 PM',
        title: 'Vidhi for Groom at Boy\'s House',
        gujaratiTitle: 'છોકરાના ઘરે પ્રસ્થાન વિધિ (બપોરે ૩:૦૦ થી ૩:૩૦)',
        location: 'Groom Residence',
        actionNotes: 'Auspicious home departure vidhi, elder family blessings, and tilak for the Groom before leaving for Katargam.',
        side: 'Boy'
      },
      {
        id: 's-21-travel',
        time: '03:30 PM – 04:00 PM',
        title: 'Travel to Katargam Assembly Point',
        gujaratiTitle: 'કતારગામ જવા રવાના (બપોરે ૩:૩૦ થી ૪:૦૦)',
        location: 'Groom Residence to Katargam (1 km from Farm)',
        actionNotes: 'Groom, close family, and guests travel from home to the Jaan starting assembly point in Katargam (1 km away from farm).',
        side: 'Boy'
      },
      {
        id: 's-21-girl-departure',
        time: '04:00 PM',
        title: 'Bride Leaves for Marriage Farm',
        gujaratiTitle: 'દીકરી મેરેજ ફાર્મ જવા રવાના (સાંજે ૪:૦૦ વાગે)',
        location: 'Bride Residence to Marriage Farm Venue',
        actionNotes: 'Bride departs with family members for the marriage farm venue to be settled and ready before Jaan arrives.',
        side: 'Girl',
        urgentRule: 'Bride leaves for marriage farm at 4:00 PM to prepare for Jaan welcome!'
      },
      {
        id: 's-21-jaan',
        time: '04:00 PM – 04:30 PM',
        title: 'Jaan Kadhvani (Departure) & Procession to Marriage Farm',
        gujaratiTitle: 'જાન કાઢવી (૪ થી ૪:૩૦) - ૫:૩૦ વાગે મેરેજ ફાર્મ પહોંચવું',
        location: 'Katargam Assembly to Marriage Farm Venue',
        actionNotes: 'High-energy Jaan procession departs with ICER truck, 4B+4T DJ sound rig, dancing family & baarat. Reach marriage farm venue by 5:30 PM.',
        side: 'Boy',
        soundRig: 'ICER Truck 4 Base 4 Top + C-truss & flowers (₹15,000)',
        urgentRule: 'Jaan leaves at 4:00 PM sharp, reach marriage farm by 5:30 PM!'
      },
      {
        id: 's-21-welcome',
        time: '05:30 PM – 06:30 PM',
        title: 'Rituals for Boy & Girl Together (Pokhvanu & Welcome)',
        gujaratiTitle: 'છોકરા અને છોકરીની સાથે વિધિ અને પોંખણું (સાંજે ૫:૩૦ થી ૬:૩૦)',
        location: 'Marriage Farm Entrance & Welcome Stage',
        actionNotes: 'Grand Pokhvanu rituals by Bride\'s mother and elders. Auspicious welcoming aarti and joint entry ceremonies for bride and groom together.',
        side: 'Both'
      },
      {
        id: 's-21-varmala',
        time: '06:30 PM – 07:30 PM',
        title: 'Varmala & Kanya Agaman in Mandvo',
        gujaratiTitle: 'વરમાળા અને કન્યા આગમન માંડવામાં (સાંજે ૬:૩૦ થી ૭:૩૦)',
        location: 'Marriage Farm Mandap',
        actionNotes: 'Grand Varmala exchange under floral umbrella with celebratory music. Bride enters the wedding Mandap escorted by maternal uncles (Mama).',
        side: 'Both',
        soundRig: '2 Base 2 Top (₹4,000, slow music / lagan geet)'
      },
      {
        id: 's-21-guestdinner',
        time: '06:30 PM – 09:30 PM',
        title: 'Meman Badha Jamanvar (Wedding Dinner Feast)',
        gujaratiTitle: 'મહેમાનોનો જમણવાર (સાંજે ૬:૩૦ થી ૯:૩૦)',
        location: 'Marriage Farm Dining Grounds',
        actionNotes: 'Grand wedding dinner feast served to all invited wedding guests, relatives, and family friends.',
        side: 'Both'
      },
      {
        id: 's-21-lagan',
        time: '07:30 PM – 09:30 PM',
        title: 'Lagan Process (Hastamelap, Kanyadaan & Phera)',
        gujaratiTitle: 'લગ્ન વિધિ: હસ્તમેળાપ, કન્યાદાન અને ફેરા (સાંજે ૭:૩૦ થી ૯:૩૦)',
        location: 'Sacred Wedding Mandap',
        actionNotes: 'Core Vedic Gujarati wedding rituals performed by Gor Maharaj: Kanyadaan, Hastamelap, Mangalphera around the sacred fire, and Saptapadi vows.',
        side: 'Both',
        urgentRule: 'Sacred phere and core lagan rituals strictly from 7:30 PM – 9:30 PM!'
      },
      {
        id: 's-21-couple-dinner',
        time: '09:30 PM – 10:00 PM',
        title: 'Dinner for Newlywed Couple',
        gujaratiTitle: 'નવદંપતીનું જમણવાર (રાત્રે ૯:૩૦ થી ૧૦:૦0)',
        location: 'Private Couple Dining Area',
        actionNotes: 'Peaceful dinner break served for the newlywed couple after completion of the sacred Pheras and main rituals.',
        side: 'Both'
      },
      {
        id: 's-21-girl-vidhi',
        time: '10:00 PM – 10:30 PM',
        title: 'Special Vidhi for Bride (Girl\'s Side Rituals)',
        gujaratiTitle: 'દીકરી માટેની વિધિઓ અને આશીર્વાદ (રાત્રે ૧૦:૦૦ થી ૧૦:૩૦)',
        location: 'Mandap / Bride Family Area',
        actionNotes: 'Family blessings, final gifts, shagun, and special emotional farewell rituals performed for the Bride by her family and elders.',
        side: 'Girl'
      },
      {
        id: 's-21-viday',
        time: '10:30 PM',
        title: 'Viday (Farewell from Girl to Boy\'s House)',
        gujaratiTitle: 'વિદાય (દીકરીની વિદાય - સાસરે જવા રવાના - રાત્રે ૧૦:૩૦)',
        location: 'Marriage Farm Gate / Car Departure',
        actionNotes: 'Heartfelt Viday ceremony. Bride departs from her parental family with coconut toss and blessings, travelling to the groom\'s residence.',
        side: 'Both',
        urgentRule: 'Viday departs from marriage farm at 10:30 PM sharp!'
      },
      {
        id: 's-21-mandir',
        time: '11:00 PM',
        title: 'Mandir Darshan (Visit Holy Temple for Blessings)',
        gujaratiTitle: 'મંદિરે દર્શન અને આશીર્વાદ (રાત્રે ૧૧:૦૦ વાગે)',
        location: 'Surat Holy Temple (Mandir)',
        actionNotes: 'Newlywed couple visits a holy temple (Mandir e jay avanu) together to seek divine blessings for a joyful married life.',
        side: 'Both',
        urgentRule: 'Newlywed couple visits holy temple together at 11:00 PM!'
      },
      {
        id: 's-21-couple-vidhi',
        time: '11:30 PM – 12:00 AM',
        title: 'Marriage Couple Welcoming Vidhi (Gruh Pravesh at Groom\'s House)',
        gujaratiTitle: 'નવદંપતી ગૃહ પ્રવેશ અને વિધિ (રાત્રે ૧૧:૩૦ થી ૧૨:૦૦)',
        location: 'Groom Residence Entrance',
        actionNotes: 'Gruh Pravesh rituals: mother-in-law welcomes couple with aarti, kicking the auspicious rice kalash, entering right foot first, and playful ring-in-milk (Aeki Beki) game.',
        side: 'Both'
      }
    ]
  }
];


export const INITIAL_DECISION_POINTS: DecisionPoint[] = [
  {
    id: 'dec-prewed',
    question: 'Pre-Wedding Couple Shoot: Destination Scope & Trip Duration?',
    options: [
      'National Trip (2-3 Days: Udaipur Palaces / Goa Beaches / Jaipur)',
      'International Trip (5-7 Days / 1 Week: Dubai Desert & Marina / Bali Villas)',
      'Regional Gujarat (1-2 Days: Vadodara Laxmi Vilas / Dumas / Surat Film Sets)'
    ],
    status: 'Pending',
    decision: '',
    side: 'Both'
  },
  {
    id: 'dec-1',
    question: 'Ask elders: Annual function timing in first half or second half?',
    options: ['First Half (Morning)', 'Second Half (Evening)'],
    status: 'Pending',
    decision: '',
    side: 'Both'
  },
  {
    id: 'dec-2',
    question: 'Ask elders: Marriage together at Silver Farm or separate mandvos?',
    options: ['Together at Silver Farm', 'Separate Mandvos'],
    status: 'Pending',
    decision: '',
    side: 'Both'
  },
  {
    id: 'dec-3',
    question: 'Girl side: Confirm Gor Maharaj decision date for Lagan Lakhan?',
    options: ['15 February (Finalized)', '17 February', '18 February'],
    status: 'Decided',
    decision: '15 February 2027 (Finalized)',
    side: 'Girl'
  },
  {
    id: 'dec-4',
    question: 'Mandvo location: Inside Farm Dome (if available) or construct standalone mandvo?',
    options: ['Inside Farm Dome', 'Construct Standalone Mandap'],
    status: 'Pending',
    decision: '',
    side: 'Both'
  },
  {
    id: 'dec-5',
    question: 'Garba ice cream counter: Joint (bhega) or separate (pot-potani tya)?',
    options: ['Joint Counter (Bhega)', 'Separate Counters (Pot-potani tya)'],
    status: 'Pending',
    decision: '',
    side: 'Both'
  }
];


export const INITIAL_NOTES: PlanningNote[] = [
  {
    id: 'note-prewed',
    title: 'Pre-Wedding Photography Shoot Trip (National vs. International Blueprint)',
    category: 'Rituals & Traditions',
    side: 'Both',
    content: `• Standalone Couple Photography Project:
  The pre-wedding shoot is completely separate from the Feb 17/18 home rituals (Randel, Lagan Lakhan, Haldi). It is an independent 2-3 day (national) or 1-week (international) travel project conducted in November or December 2026.

• Scope & Duration Options:
  1. National Trip (2–3 Days): Udaipur (Lake Pichola, heritage courtyards), Goa (South Goa cliffs & beaches), or Jaipur. Fast weekend trip, budget ~₹1.2L–₹1.8L.
  2. International Trip (5–7 Days / 1 Week): Dubai (desert dunes, downtown skyline, luxury yacht), Bali (Canggu villas, waterfalls, beaches), or Thailand. Rich cinematic diversity, budget ~₹2.8L–₹4L.
  3. Regional Gujarat (1–2 Days): Vadodara Laxmi Vilas Palace, Dumas beach, or high-end film studio sets in Surat/Ahmedabad (~₹50k–₹80k).

• Key Deliverables:
  1. 1 Cinematic Film (3–4 mins 4K with romantic soundtrack)
  2. 2 Instagram Reels (9:16 vertical cuts for social media)
  3. 40–50 Color-graded High-Res Master Photos
  4. 1 Teaser Trailer (30–45s) for Save-The-Date digital invitations
  5. Full HD Landscape Cut formatted for LED Wall display on Feb 20 Garba Night!

• Wardrobe Themes (4 Looks):
  1. Royal Heritage (Jodhpuri Bandhgala & Regal Embroidered Lehenga)
  2. Western Glamour (Black Tuxedo & Dramatic Evening Trail Gown)
  3. Breezy Casual Chic (Pastel linen & Flowy sundress / co-ord)
  4. Contemporary Night (Modern Indo-western fusion under fairy lights)

• Timelines:
  - Oct 2026: Lock destination & book photography crew
  - Nov 2026: Book flights, stay, and fit 4 outfits
  - Dec 2026: Shoot trip execution
  - Jan 2027: Teaser for invitations & video ready for Feb 20 Garba LED wall!`,
    pinned: true,
    tags: ['Pre-Wedding', 'Photography', 'National vs International', 'Outfits', 'LED Display'],
    updatedAt: '2026-10-22'
  },
  {
    id: 'note-1',
    title: 'Feb 15–19 Finalized Home Rituals & Events Schedule',
    category: 'Rituals & Traditions',
    side: 'Both',
    content: `• Feb 15 (Finalized): Lagan Lakhan & Haldi
  - 08:00 AM: Randel Tedva at Groom's home.
  - 10:00 - 11:00 AM: Gor Maharaj completes Lagan Lakhan writing at Bride's home.
  - 11:00 AM - 12:00 PM: Bride's brothers (5-6 people) deliver Lagan and ritual saman to Groom's home (~100 present). Give shagun covers and hospitality.
  - 12:00 - 01:00 PM: Groom side lunch Jamanvar (~100 guests).
  - 04:00 PM: Haldi Rasam for Groom (guests invited for 4:00 PM).
  - 06:00 - 07:00 PM: Evening Jamanvar dinner (Bride side has larger guest gathering).

• Feb 16: Randal Tedva at Girl's House
  - 08:00 - 09:00 AM: Auspicious Randal Tedva invocation puja at Bride's home (Girl side only).

• Feb 17: Vana Rasam at Girl's House
  - 04:00 PM: Vana Rasam rituals at Girl's place. Groom is called upon for the rasam together and dedicated couple photosession!

• Feb 18: Mehndi Rasam at Girl's House
  - 04:00 PM: Festive Mehndi at Girl's place. Groom is called upon with 1-2 friends for couple photosession.

• Feb 19: Mameru, Chab Giving & Sanji Na Geet
  - 11:00 AM - 01:30 PM: Mameru ceremony at Bride's house (Girl side only with maternal uncle Mama & family).
  - 04:30 PM: Chab Giving by Boy's side. Groom's family presents decorated Chab gift hampers to Bride's family.
  - 09:00 PM: Sanji Na Geet night at Girl's house (Girl side guests only).`,
    pinned: true,
    tags: ['15 Feb', '16 Feb', '17 Feb', '18 Feb', '19 Feb', 'Randel', 'Vana', 'Mehndi', 'Mameru', 'Chab', 'Sanji'],
    updatedAt: '2026-10-23'
  },
  {
    id: 'note-2',
    title: '20 Feb Schedule: Parlour, Mandvo, Joint Jamanvar & Garba',
    category: 'Rituals & Traditions',
    side: 'Both',
    content: `• Parlour: Starts at 11:00 AM or 12:00 PM strictly for Bride!
• Mandvo: 02:00 PM from Boy's side (need to ask Girl's side timing).
• During Mandvo: Both sides place mandvo for each other (ek bija na mandvo nakhshe), then Girl side comes to do Chandlo for Groom, and Chab exchange.
• Joint Jamanvar: Boy and Girl side families dine TOGETHER from 6:00 - 6:30 PM!
• Raas Garba: Kicks off at 08:00 PM with Dhaval Jajenwala 6x6 DJ sound rig.
• Surat Police Curfew: Close loud DJ at 10:00 PM if police comes, otherwise continue rocking till 12:00 AM midnight!
• Ice Cream: Served at 11:30 PM to all guests.`,
    pinned: true,
    tags: ['20 Feb', 'Mandvo', 'Joint Jamanvar', 'Garba', 'Police Curfew'],
    updatedAt: '2026-10-22'
  },
  {
    id: 'note-3',
    title: '21 Feb Complete Wedding Day Runsheet: Parlour, Jaan, Lagan & Mandir',
    category: 'Rituals & Traditions',
    side: 'Both',
    content: `• 08:00 AM – 10:00 AM: Bride & Groom get ready in parlour.
• 10:00 AM – 12:00 PM: Dedicated photography & couple photoshoot.
• 01:00 PM – 02:00 PM: Lunch at own house or together as couple.
• 02:30 PM – 03:00 PM: Touch up for Groom at boy's house.
• 03:00 PM – 04:00 PM: Bride makeup touch-up at girl's house.
• 03:00 PM – 03:30 PM: Departure vidhi for Groom at boy's house.
• 03:30 PM – 04:00 PM: Travel to Katargam Jaan starting assembly point.
• 04:00 PM: Bride leaves for marriage farm venue.
• 04:00 PM – 04:30 PM: Jaan Kadhvani on ICER truck; reach marriage farm by 5:30 PM!
• 05:30 PM – 06:30 PM: Welcoming & Pokhvanu rituals for boy and girl together.
• 06:30 PM – 07:30 PM: Varmala & Kanya Agaman into the wedding mandap.
• 06:30 PM – 09:30 PM: Meman badha jamanvar (guest wedding dinner feast).
• 07:30 PM – 09:30 PM: Sacred Lagan process (Hastamelap, Kanyadaan, then sacred Phera).
• 09:30 PM – 10:00 PM: Dinner break for newlywed couple.
• 10:00 PM – 10:30 PM: Special farewell rituals & blessings for Bride by girl's family.
• 10:30 PM: Viday of Bride to Groom's home!
• 11:00 PM: Mandir Darshan (couple visits holy temple together for blessings).
• 11:30 PM – 12:00 AM: Marriage couple welcoming vidhi (Gruh Pravesh) at groom's house.`,
    pinned: true,
    tags: ['21 Feb', 'Wedding Day', 'Jaan', 'Lagan', 'Viday', 'Mandir', 'Gruh Pravesh'],
    updatedAt: '2026-10-24'
  },
  {
    id: 'note-4',
    title: 'Sound System Rig, DJ & Lighting (Dhaval Jajenwala & Silver Farm)',
    category: 'Sound & Technical',
    side: 'Boy',
    content: `• Haldi (Feb 15, 4 PM): 2 Base, 2 Top. Rate ₹4,000 with 1 sound operator.
• Sangeet / Garba Night (Feb 20, 8 PM): Rate ₹24,000. 6 Base, 6 Top, 16 LED small round lights, 6 Safi (white floodlights), 4 battle top lights. 1 sound operator + 1 lighting operator.
• Truss & Structure: 40ft length C-truss structure + top square ring. 6 Base 6 Top is plenty of punch for 500–800 guests at Silver Farm.
• Police 10 PM Curfew: Turn down high decibel sound at 10:00 PM if police comes, else till 12:00 AM.
• Jaan (Feb 21 04:00 PM): Need ICER truck with 4 Base, 4 Top, sound operator, C-truss & floral decoration. Total ₹15,000.
• Lagan (Feb 21 06:30 PM - 12 AM): 2 Base, 2 Top. Rate ₹4,000 with 1 operator (slow music / lagan geet).
• Generator: Available on rent. Get vendor contact number directly from Dhaval Jajenwala.`,
    pinned: false,
    tags: ['Dhaval Jajenwala', 'DJ', 'Truss', 'ICER'],
    updatedAt: '2026-10-23'
  },
  {
    id: 'note-5',
    title: 'Two-Sided Coordination (Boy\'s Side & Girl\'s Side Tracking)',
    category: 'Family & Fiance',
    side: 'Both',
    content: `• Groom & Bride Joint Workflow (Feb 15–21, 2027):
  - Both partners track preparations collaboratively using the "Boy's Side" and "Girl's Side" switcher.
  - Feb 15 (Finalized): Randel at Groom home (8 AM), Gor Maharaj Lagan Lakhan at Bride home (10-11 AM), brothers deliver Lagan to Groom home (~100 present), Boy Lunch (12 PM), Boy Haldi (4 PM), Evening Jamanvar.
  - Feb 16: Randal Tedva at Girl's house (8:00–9:00 AM, Girl side).
  - Feb 17: Vana Rasam at Girl's place (Groom called for rasam together & couple photoshoot).
  - Feb 18: Mehndi at Girl's place (Groom called for couple photoshoot).
  - Feb 19: Mameru (11 AM, Girl side only), Chab Giving by Boy's side (4:30 PM), Sanji Na Geet (9 PM, Girl side only).
  - Feb 20: Bride Parlour (11 AM), Mandvo at 2 PM, Joint Jamanvar (dinner together at 6:00–6:30 PM), Raas Garba (8 PM till midnight).
  - Feb 21: Afternoon Jaan departure on ICER truck at 4:00 PM sharp to Katargam, 5:30 PM Entry, 6:30 PM Mandap, 12 AM midnight lagan finish & holy Mandir visit.`,
    pinned: true,
    tags: ['Boy Side', 'Girl Side', 'Fiance Coordination'],
    updatedAt: '2026-10-23'
  }
];



// Pre-Wedding Story Reels, Location Scouts & Presets
export const DEFAULT_STORY_REELS: PreWeddingStoryReel[] = [
  {
    id: 'story-reel-1',
    reelNumber: 1,
    title: 'Story Reel 1: Timeless Royal Heritage',
    storyTheme: 'A classic, regal romance beginning from majestic stone arches, walking through a quiet colonnade, and concluding atop sunset ramparts overlooking the sea.',
    groomOutfit: 'Royal Navy / Emerald Jodhpuri Bandhgala Suit with pocket square & tan formal leather shoes',
    brideOutfit: 'Rich Wine-Red / Deep Crimson Embroidered Silk Heritage Lehenga with subtle temple jewelry',
    outfitStatus: 'To Select',
    outfitNotes: 'Same royal outfit is worn across all 3 scene locations to create a seamless continuous story narrative cut.',
    audioSongVibe: 'Soulful acoustic fusion (Classical Flute / Kesariya Gujarati instrumental strings)',
    durationTarget: '30–45s (9:16 vertical)',
    status: 'Planning',
    scenes: [
      {
        id: 's-r1-1',
        sceneNumber: 1,
        locationName: 'Historic Stone Fortress Arches (Moti Daman / Champaner)',
        sceneAction: 'Groom checks watch and looks up; Bride arrives gracefully through the massive stone archway; slow-motion turning eye contact and radiant smile.',
        shotType: 'Cinematic wide reveal zooming smoothly into medium portrait (f/1.8 bokeh)',
        lighting: 'Early Morning Golden Hour (07:30 AM)'
      },
      {
        id: 's-r1-2',
        sceneNumber: 2,
        locationName: 'Ancient Monastery Colonnade / Shaded Courtyard',
        sceneAction: 'Couple strolling together along carved stone pillars, laughing candidly, Groom gently guiding Bride through the walkway.',
        shotType: 'Smooth 3-axis gimbal backward tracking walking shot',
        lighting: 'Soft diffused morning sunlight (08:45 AM)'
      },
      {
        id: 's-r1-3',
        sceneNumber: 3,
        locationName: 'Fortress Ramparts / Sea Wall Panoramic Overlook',
        sceneAction: 'Couple leaning together over stone battlements watching the ocean horizon; warm golden sunset embrace and twirl.',
        shotType: 'Low-angle golden rim-light silhouette followed by high aerial drone pull-back',
        lighting: 'Golden Hour Sunset (05:45 PM)'
      }
    ]
  },
  {
    id: 'story-reel-2',
    reelNumber: 2,
    title: 'Story Reel 2: Coastal Breeze & Golden Hour Sunset',
    storyTheme: 'Breezy, carefree romantic journey transitioning from shaded casuarina pine woods to a windswept rocky shoreline and sunset sand reflection.',
    groomOutfit: 'Crisp Ivory / Sage-Green Linen open-collar shirt, tailored beige cotton chinos & loafers',
    brideOutfit: 'Flowing Pastel Silk / Georgette Satin Gown (Dusty Rose or Champagne) with graceful wind sweep',
    outfitStatus: 'To Select',
    outfitNotes: 'Light, breathable resort styling kept consistent across the 3 nature backdrops.',
    audioSongVibe: 'Dreamy romantic Bollywood slow reverb / Indie acoustic guitar rhythm',
    durationTarget: '30–45s (9:16 vertical)',
    status: 'Planning',
    scenes: [
      {
        id: 's-r2-1',
        sceneNumber: 1,
        locationName: 'Casuarina Pine Woods / Forest Pathway (Dumas / Daman Coast)',
        sceneAction: 'Running hand-in-hand through rows of tall pine trees; natural candid laughter as pine needles scatter; sunbeams cutting through branches.',
        shotType: 'Medium forward tracking shot with natural lens flare (60 fps slow-mo)',
        lighting: 'Morning / Early Afternoon Sunlight (10:30 AM)'
      },
      {
        id: 's-r2-2',
        sceneNumber: 2,
        locationName: 'Rocky Shoreline / Coastal Sea Promenade',
        sceneAction: 'Bride\'s dress flowing in sea breeze; seated on rocks sharing a whisper; close-up hand holding and affectionate laughter.',
        shotType: 'Tight 85mm prime lens close-up with soft ocean spray bokeh',
        lighting: 'Late Afternoon Warm Glow (04:30 PM)'
      },
      {
        id: 's-r2-3',
        sceneNumber: 3,
        locationName: 'Black Sand Beach Shoreline (Dumas / Jampore Beach)',
        sceneAction: 'Couple dancing slowly in ankle-deep wet sand reflecting orange and purple twilight skies; iconic slow-motion dip and silhouette embrace.',
        shotType: 'Wide 4K horizontal/vertical hybrid cut with sky reflection & smooth orbit',
        lighting: 'Golden Sunset into Blue Hour (06:00 PM)'
      }
    ]
  },
  {
    id: 'story-reel-3',
    reelNumber: 3,
    title: 'Story Reel 3: Modern Glamour & Playful City Date',
    storyTheme: 'High-energy stylish modern romance starting with an aesthetic cafe date, walking past retro street elements, and climaxing under evening fairy lights.',
    groomOutfit: 'Sharp Black / Charcoal 3-piece Suit or Structured Tuxedo Blazer with crisp open collar',
    brideOutfit: 'Contemporary Black / Emerald Satin High-Slit Gown or Modern Draped Indo-Western Saree',
    outfitStatus: 'To Select',
    outfitNotes: 'Glamorous evening attire maintained across cafe, street and twilight lights scenes.',
    audioSongVibe: 'Upbeat romantic indie pop with crisp beat-drops timed to scene cuts',
    durationTarget: '30–45s (9:16 vertical)',
    status: 'Planning',
    scenes: [
      {
        id: 's-r3-1',
        sceneNumber: 1,
        locationName: 'Aesthetic European Cafe Terrace / Glasshouse Set (Surat / Studio)',
        sceneAction: 'Espresso toast across marble bistro table, shared smiling glances, Groom gently adjusting Bride\'s earring.',
        shotType: 'Over-the-shoulder medium shot cutting to intimate eye-contact portrait',
        lighting: 'Afternoon Soft Indoor / Covered Terrace (03:00 PM)'
      },
      {
        id: 's-r3-2',
        sceneNumber: 2,
        locationName: 'Retro Cobblestone Alley / Vintage Roadster Car (Surat Sets / Daman)',
        sceneAction: 'Couple walking with confidence side-by-side in stylish sunglasses; playful bump of shoulders and twirl beside vintage vehicle.',
        shotType: 'Full-body strut tracking shot from low angle',
        lighting: 'Late Afternoon Golden Light (05:00 PM)'
      },
      {
        id: 's-r3-3',
        sceneNumber: 3,
        locationName: 'Twilight Fairy Light Canopy & Illuminated Fountain',
        sceneAction: 'Slow romantic dance beneath hanging Edison bulbs and fairy lights; Groom lifts/dips Bride under sparkling golden bokeh.',
        shotType: 'Dramatic 360-degree orbit shot at 120fps with bokeh burst',
        lighting: 'Blue Hour & Night Illumination (07:15 PM)'
      }
    ]
  }
];


export const DEFAULT_LOCATION_OPTIONS: LocationOption[] = [
  {
    id: 'loc-daman',
    name: 'Daman (Moti Daman Fort, Lighthouse & Jampore Beach)',
    tagline: 'Top Pick: 400-Yr Portuguese Stone Forts & Ocean Views — Only 2h Drive',
    category: 'Coastal / Heritage',
    distanceFromSurat: '110 km',
    driveTime: '1.5 – 2 hours via NH48',
    baseCost: 0,
    baseCostLabel: 'Free / Zero Venue Charge',
    propCostNotes: 'Zero prop surcharges! Beach horse ride or boat is standard tourist rate (₹200–₹500), not ₹3,000 venue fee.',
    rulesFlexibility: 'Very Flexible',
    bestBackdrops: [
      'Moti Daman Fort 400-year massive carved stone arches',
      'Dominican Monastery ancient stone pillar ruins',
      'Lighthouse & stone ramparts overlooking Arabian Sea',
      'Jampore Beach black sand sunset & coastal promenade'
    ],
    pros: [
      'Zero base venue fee (public heritage monument) — saves ₹25,000 immediately compared to Anand villa',
      'Super easy 1.5–2 hours smooth highway drive from Surat (NH48) — can be done as a comfortable 1-day trip or relaxed 1-night weekend',
      'Real 16th-century Portuguese stone arches look far more authentic and cinematic than artificial studio sets',
      'Relaxed atmosphere with zero rigid hourly rules or intrusive property guards',
      'Boutique luxury hotels (The Deltin, Mirasol) available for affordable day-use rooms for makeup and outfit changes'
    ],
    cons: [
      'Public monument: best to shoot on a weekday (Tuesday–Thursday) to enjoy empty arches without tourist crowds',
      'Outdoor weather dependent (Nov/Dec is ideal pleasant winter season)'
    ],
    isRecommended: true,
    status: 'Selected'
  },
  {
    id: 'loc-surat-sets',
    name: 'Surat Film City & Pre-Wedding Studios (The Frame / Photo Palace)',
    tagline: 'Zero Travel Fatigue: 35+ Backdrops Right in Surat with Makeup Rooms',
    category: 'Film City Studio',
    distanceFromSurat: '15 – 25 km',
    driveTime: '25 – 45 mins within Surat',
    baseCost: 12000,
    baseCostLabel: '₹10,000 – ₹15,000 (Full Day Slot)',
    propCostNotes: 'ALL major props (vintage car, telephone booth, rustic swing, neon glasshouse, retro bike) INCLUDED in base fee!',
    rulesFlexibility: 'Moderate',
    bestBackdrops: [
      'European Cobblestone Alley with warm street lamps',
      'Santorini Greek white-and-blue dome sets',
      'Rustic Barn, hay bales & vintage green truck',
      'Glasshouse conservatory with fairy light canopy'
    ],
    pros: [
      'Zero highway travel fatigue — wake up at normal time and shoot 20 minutes from home',
      'Private air-conditioned vanity rooms dedicated for Bride & Groom outfit changes and makeup touchups',
      'Props like vintage cars and swings are included in the slot price without extra ₹3,000 charges',
      'Guaranteed consistent artificial lighting and zero public crowd interference',
      'Can easily shoot 3 distinct looks and 9 scenes within a single 8-hour shift'
    ],
    cons: [
      'Man-made studio sets rather than authentic historic architecture',
      'Must book weekend slots 2–3 weeks in advance'
    ],
    isRecommended: true,
    status: 'Shortlisted'
  },
  {
    id: 'loc-vadodara',
    name: 'Vadodara & Champaner UNESCO Heritage Corridor',
    tagline: 'Grand Royal Indo-Saracenic Architecture & 15th-Century Stone Arches',
    category: 'Heritage Palace',
    distanceFromSurat: '140 km',
    driveTime: '2 – 2.5 hours via NH48 / Vande Bharat',
    baseCost: 500,
    baseCostLabel: 'Nominal ASI ticket (₹25–₹50 / person)',
    propCostNotes: 'Public heritage monument; no prop fees',
    rulesFlexibility: 'Moderate',
    bestBackdrops: [
      'Laxmi Vilas Palace sprawling royal lawns & grand facade',
      'Champaner Jami Masjid 15th-century carved stone arches & minarets',
      'Kabutarkhana scenic lake pavilion',
      'Sayaji Baug vintage garden gazebo'
    ],
    pros: [
      'Unmatched royal grandeur — Laxmi Vilas Palace is 4 times larger than Buckingham Palace',
      'Champaner stone arches create dramatic high-fashion cinematic frames',
      'Super easy 1h 45m train connection via Vande Bharat or 2.5h smooth highway drive from Surat'
    ],
    cons: [
      'Laxmi Vilas Palace interior shoots have restricted photography; exterior lawns and courtyards accessible',
      'ASI monuments at Champaner prohibit large heavy light setups (handheld gimbals and drone outside restricted perimeter are fine)'
    ],
    status: 'Shortlisted'
  },
  {
    id: 'loc-silvassa',
    name: 'Silvassa & Dudhani Lake / Luxury Nature Resort',
    tagline: 'Genuine Lakefront Boating & Lush Green Foothills',
    category: 'Nature & Lake',
    distanceFromSurat: '120 km',
    driveTime: '2 hours via NH48',
    baseCost: 3500,
    baseCostLabel: '₹0 (Public Lake) to ₹4,000 (Resort Day pass)',
    propCostNotes: 'Real shikara / speedboat on Dudhani Lake at standard tourist rates (~₹400 for 30 mins) instead of ₹3,000 venue upcharge!',
    rulesFlexibility: 'Very Flexible',
    bestBackdrops: [
      'Dudhani Lake open waters with wooden shikara boat',
      'Madhuban Dam water reservoir waterfront',
      'Treat Resort landscaped swimming pool & manicured lawns',
      'Vasona forest trail canopy'
    ],
    pros: [
      'Authentic open lake with real water boating without venue extortion',
      'Lush green hills and peaceful calm environment away from crowds',
      'Only 2 hours highway drive from Surat'
    ],
    cons: [
      'Fewer palace or European backdrops (best suited for nature, water, and resort glamor)'
    ],
    status: 'Evaluating'
  },
  {
    id: 'loc-dumas',
    name: 'Dumas Coastline & Casuarina Pine Woods (Surat)',
    tagline: 'Local Moody Coastal Sunset & Tall Pine Groves',
    category: 'Coastal / Heritage',
    distanceFromSurat: '18 km',
    driveTime: '30 mins from city center',
    baseCost: 0,
    baseCostLabel: 'Free / Public',
    propCostNotes: 'Beach camel/horse ride costs ₹100–₹200 only; zero property fees',
    rulesFlexibility: 'Very Flexible',
    bestBackdrops: [
      'Casuarina pine tree shaded walkway',
      'Moody dark sand coastline at golden hour',
      'Waves breaking over wet sand reflecting twilight clouds',
      'Sultanpur coastal road & quiet rock pier'
    ],
    pros: [
      'Inside Surat — perfect for an effortless golden hour sunset reel (Reel 2)',
      'Can be paired in the same afternoon with a morning Surat studio set shoot',
      'Completely free with zero commercial permits needed for small gimbal crew'
    ],
    cons: [
      'Public visitors on weekend evenings (recommend weekday sunset or 6:30 AM sunrise shoot)'
    ],
    status: 'Shortlisted'
  },
  {
    id: 'loc-anand-villa',
    name: 'The Rustic Villa (Anand)',
    tagline: 'Evaluated Reluctant Pick: Base ₹25,000 + ₹3,000 / Prop + Strict Rules',
    category: 'Anand Villa (Reluctant)',
    distanceFromSurat: '185 km',
    driveTime: '3.5 – 4 hours each way',
    baseCost: 25000,
    baseCostLabel: '₹25,000 Base Charge',
    propCostNotes: '₹3,000 EXTRA per prop: Horse (₹3,000), Boat (₹3,000), Vintage Car (₹3,000), Smoke (₹2,000) -> Quickly adds ₹11,000+!',
    rulesFlexibility: 'Strict (Extra Charges)',
    bestBackdrops: [
      'Rustic farmhouse wooden facade',
      'Artificial pond with small rowboat',
      'Equestrian paddock & horse path',
      'Cobblestone courtyard set'
    ],
    pros: [
      'Consolidated variety of sets in one private gated property',
      'Horse and boat props are physically on the premise'
    ],
    cons: [
      'High base charge of ₹25,000 PLUS ₹3,000 extra per prop pushes total venue cost to ₹35,000–₹40,000+',
      'Strict rules on slot duration, rigid staff surveillance, and overtime penalties',
      'Long 3.5 to 4-hour highway drive from Surat each way (causes tiredness before shooting)',
      'Artificial constructed sets compared to genuine heritage forts like Daman or Champaner'
    ],
    isReluctant: true,
    status: 'Evaluating'
  }
];


export const DEFAULT_PROPS: PropItem[] = [
  { id: 'prop-smoke', name: 'Colored Smoke Bombs / Cold Pyro Sparks', cost: 1500, selected: true, notes: 'Adds dramatic color pop to slow-motion walking cuts' },
  { id: 'prop-lights', name: 'Portable Fairy Lights & Edison Bulbs String', cost: 2000, selected: true, notes: 'Warm twilight ambiance for Reel 3 evening scene' },
  { id: 'prop-steamer', name: 'Garment Steamer & Pop-up Changing Vanity Tent', cost: 1500, selected: true, notes: 'Essential for crisp outfit changes on location' },
  { id: 'prop-horse', name: 'Horse Photoshoot Setup', cost: 3000, selected: false, notes: 'Charged ₹3,000 at Anand Villa; local beach horse in Daman/Dumas is ~₹300' },
  { id: 'prop-boat', name: 'Row Boat / Water Setup', cost: 3000, selected: false, notes: 'Charged ₹3,000 at Anand Villa; Dudhani Lake shikara is ~₹400' },
  { id: 'prop-car', name: 'Vintage Open Car / Scooter Setup', cost: 3000, selected: false, notes: 'Free/included at Surat Studio Sets; ₹3,000 extra at Anand Villa' }
];

export const SURAT_REGIONAL_PRESET: PreWeddingTripPlan = {
  tripType: 'SURAT_REGIONAL',
  destination: 'Daman (Moti Daman Fort & Jampore Coast) + Surat Local Sets (1–2 Days)',
  durationLabel: '1–2 Days Easy Road Trip',
  targetDates: 'Dec 08 – Dec 09, 2026',
  travelMode: 'Private AC Innova / Road Trip from Surat (1.5–2 hours)',
  flightStatus: 'Not Needed',
  hotelStatus: 'To Book',
  passportVisaStatus: 'Not Needed',
  photographerAgency: 'To Book (Candid Cinematographer + Drone Specialist)',
  contactPerson: 'Lead Cinematographer',
  phone: '',
  crewCount: 3,
  baseVenueCost: 5000,
  propsCost: 5000,
  crewCost: 60000,
  travelCost: 5000,
  totalEstimatedCost: 75000,
  advancePaid: 0,
  deliverables: [
    '3 Cinematic Story Reels (9:16 vertical 4K edits, 1 outfit each across 3 distinct locations)',
    '1 Cinematic Pre-Wedding Highlight Film (3-4 mins 4K combining all 3 story themes with custom music)',
    '1 Full 4K Horizontal Cut formatted for Feb 20 Raas-Garba LED screen at Silver Farm',
    '40-50 Color-graded High-Res Master Retouched Photos (framed portraits & digital)',
    '1 Quick Save-The-Date Teaser Reel (30-45s) for WhatsApp digital invitations'
  ],
  storyReels: DEFAULT_STORY_REELS,
  locationOptions: DEFAULT_LOCATION_OPTIONS,
  props: DEFAULT_PROPS,
  looks: [
    {
      id: 'look-1',
      themeTitle: 'Story Reel 1: Timeless Royal Heritage',
      groomOutfit: 'Royal Navy / Emerald Jodhpuri Bandhgala Suit with pocket square & formal leather shoes',
      brideOutfit: 'Rich Wine-Red / Deep Crimson Embroidered Silk Heritage Lehenga',
      locationBackdrop: 'Moti Daman Fort arched gates, monastery ruins & stone ramparts',
      status: 'Planning'
    },
    {
      id: 'look-2',
      themeTitle: 'Story Reel 2: Coastal Breeze & Golden Sunset',
      groomOutfit: 'Crisp Ivory / Sage Linen open-collar shirt with tailored beige chinos & loafers',
      brideOutfit: 'Flowing Pastel Silk / Georgette Satin Gown (Dusty Rose / Champagne)',
      locationBackdrop: 'Pine wood forest groves & black sand beach shoreline at sunset',
      status: 'Planning'
    },
    {
      id: 'look-3',
      themeTitle: 'Story Reel 3: Modern Glamour & City Date',
      groomOutfit: 'Sharp Black Tuxedo / Charcoal Structured 3-piece Suit',
      brideOutfit: 'Contemporary Black / Emerald Satin Gown or Modern Indo-Western Saree',
      locationBackdrop: 'Aesthetic cafe terrace, cobblestone alley & evening fairy lights',
      status: 'Planning'
    }
  ],
  checklist: [
    {
      id: 'pw-chk-1',
      stage: 'Location & Scope Decision',
      title: 'Finalize Shoot Destination: Daman Portuguese Heritage vs Surat Studio Sets (Avoid Anand Villa fees)',
      completed: false,
      notes: 'Daman is 1.5h drive from Surat with free 400-yr fort arches. Surat studio sets have 35+ backdrops with props included.'
    },
    {
      id: 'pw-chk-2',
      stage: 'Location & Scope Decision',
      title: 'Lock shoot dates (Recommended weekday Tue–Thu in Nov/Dec to ensure empty backdrops without tourist footfall)',
      completed: false,
      notes: 'Avoid weekend crowds at Daman Fort and Dumas Beach.'
    },
    {
      id: 'pw-chk-3',
      stage: 'Storyboards & 3 Reel Scripts',
      title: 'Review 3 Story Reel concepts with Cinematographer (Story 1: Royal, Story 2: Sunset Coastal, Story 3: Modern Date)',
      completed: false,
      notes: 'Each reel has 1 consistent outfit across 3 scenes to tell one fluid story.'
    },
    {
      id: 'pw-chk-4',
      stage: 'Storyboards & 3 Reel Scripts',
      title: 'Select 3 audio tracks / song rhythms matching the story moods and edit transition beats',
      completed: false,
      notes: 'Reel 1: Acoustic Gujarati folk flute, Reel 2: Breezy Bollywood reverb, Reel 3: Upbeat indie pop.'
    },
    {
      id: 'pw-chk-5',
      stage: 'Wardrobe & Outfits',
      title: 'Finalize Outfit 1 for Reel 1 (Groom Royal Jodhpuri + Bride Wine-Red Lehenga)',
      completed: false,
      notes: 'Ensure steam-ironed and packed with matching accessories.'
    },
    {
      id: 'pw-chk-6',
      stage: 'Wardrobe & Outfits',
      title: 'Finalize Outfit 2 for Reel 2 (Groom Linen Shirt + Bride Flowing Pastel Gown)',
      completed: false,
      notes: 'Lightweight fabric with maximum wind sweep for coastal shots.'
    },
    {
      id: 'pw-chk-7',
      stage: 'Wardrobe & Outfits',
      title: 'Finalize Outfit 3 for Reel 3 (Groom Black Tuxedo + Bride Modern Evening Gown)',
      completed: false,
      notes: 'Fitted formal evening styling for cafe and twilight fairy lights.'
    },
    {
      id: 'pw-chk-8',
      stage: 'Wardrobe & Outfits',
      title: 'Pack portable garment steamer, hair vanity kit, and pop-up changing tent in car',
      completed: false,
      notes: 'Ensures quick 15-minute outfit changes right near the shoot location.'
    },
    {
      id: 'pw-chk-9',
      stage: 'Photography Crew & Contract',
      title: 'Contract Cinematography Crew (Lead Director, Gimbal Operator, Drone Pilot)',
      completed: false,
      notes: 'Confirm package: 3 Story Reels (9:16) + 1 Full Master Film + 1 Garba LED Wall Cut + 40 Master Photos.'
    },
    {
      id: 'pw-chk-10',
      stage: 'Travel & Lodging',
      title: 'Arrange dedicated AC Innova car from Surat for couple, vanity trunk, and camera gear',
      completed: false,
      notes: '1.5–2 hours smooth drive via NH48.'
    },
    {
      id: 'pw-chk-11',
      stage: 'Travel & Lodging',
      title: 'Book 1 luxury hotel day-use room in Daman (e.g. The Deltin or Mirasol) for makeup prep',
      completed: false,
      notes: 'Much more comfortable than changing in public restrooms.'
    },
    {
      id: 'pw-chk-12',
      stage: 'Shoot Day Execution',
      title: 'Execute Day 1 morning shoot (07:00 AM) at Fort Arches for Story Reel 1',
      completed: false,
      notes: 'Catch morning golden hour light on stone walls.'
    },
    {
      id: 'pw-chk-13',
      stage: 'Shoot Day Execution',
      title: 'Execute afternoon pine woods & golden hour sunset beach shoot for Story Reel 2',
      completed: false,
      notes: 'Golden sunset over black sand coastline.'
    },
    {
      id: 'pw-chk-14',
      stage: 'Shoot Day Execution',
      title: 'Execute twilight evening date shoot under fairy lights for Story Reel 3',
      completed: false,
      notes: 'Capture warm Edison bulb bokeh and dancing twirl.'
    },
    {
      id: 'pw-chk-15',
      stage: 'Post-Production & Garba LED Delivery',
      title: 'Review raw footage cuts and approve sound sync for the 3 Instagram Story Reels',
      completed: false,
      notes: 'Deliver 3 reels sequentially for social media announcements.'
    },
    {
      id: 'pw-chk-16',
      stage: 'Post-Production & Garba LED Delivery',
      title: 'Receive final 4K horizontal master cut by January 15 for Feb 20 Raas-Garba LED screen',
      completed: false,
      notes: 'Hand over master cut to Dhaval Jajenwala\'s LED wall operator at Silver Farm!'
    }
  ],
  notes: 'Pre-wedding shoot planned as an easy 1–2 day road trip from Surat focusing on 3 high-impact Story Reels (same clothes, multi-location cuts). Replaced Anand Rustic Villa to eliminate high base fees and ₹3,000 prop charges.'
};

export const HERITAGE_CIRCUIT_PRESET: PreWeddingTripPlan = {
  tripType: 'HERITAGE_CIRCUIT',
  destination: 'Vadodara (Laxmi Vilas Palace) & Champaner UNESCO Stone Arches (1–2 Days)',
  durationLabel: '1–2 Days Road / Train Trip',
  targetDates: 'Dec 12 – Dec 13, 2026',
  travelMode: 'Expressway Drive / Vande Bharat Train from Surat (2 hours)',
  flightStatus: 'Not Needed',
  hotelStatus: 'To Book',
  passportVisaStatus: 'Not Needed',
  photographerAgency: 'To Book (Heritage Cinematography Specialists)',
  contactPerson: 'Lead Cinematographer',
  phone: '',
  crewCount: 3,
  baseVenueCost: 3000,
  propsCost: 3000,
  crewCost: 65000,
  travelCost: 6000,
  totalEstimatedCost: 77000,
  advancePaid: 0,
  deliverables: [
    '3 Story Reels (9:16 vertical 4K edits)',
    '1 Cinematic Pre-Wedding Highlight Film (3-4 mins 4K)',
    '1 Full 4K Horizontal Cut for Feb 20 Garba LED screen at Silver Farm',
    '40-50 Master Color-Graded Photos',
    '1 Save-The-Date Teaser Reel'
  ],
  storyReels: DEFAULT_STORY_REELS,
  locationOptions: DEFAULT_LOCATION_OPTIONS,
  props: DEFAULT_PROPS,
  looks: SURAT_REGIONAL_PRESET.looks,
  checklist: SURAT_REGIONAL_PRESET.checklist,
  notes: 'Heritage circuit focus around Vadodara & Champaner arches. Grand scale without artificial studio sets.'
};

export const ANAND_VILLA_PRESET: PreWeddingTripPlan = {
  tripType: 'ANAND_VILLA',
  destination: 'The Rustic Villa, Anand (Evaluated Option — High Base & Prop Fees)',
  durationLabel: '1–2 Days Highway Trip',
  targetDates: 'Dec 15 – Dec 16, 2026',
  travelMode: 'Highway Drive via NE1 / NH48 from Surat (3.5 – 4 hours each way)',
  flightStatus: 'Not Needed',
  hotelStatus: 'To Book',
  passportVisaStatus: 'Not Needed',
  photographerAgency: 'To Book',
  contactPerson: 'Lead Cinematographer',
  phone: '',
  crewCount: 3,
  baseVenueCost: 25000,
  propsCost: 9000,
  crewCost: 60000,
  travelCost: 8000,
  totalEstimatedCost: 102000,
  advancePaid: 0,
  deliverables: [
    '3 Story Reels (9:16 vertical 4K edits)',
    '1 Cinematic Pre-Wedding Film (3-4 mins)',
    '1 Horizontal Cut for Garba LED Wall',
    '40 Master Photos',
    '1 Teaser Reel'
  ],
  storyReels: DEFAULT_STORY_REELS,
  locationOptions: DEFAULT_LOCATION_OPTIONS,
  props: DEFAULT_PROPS.map(p => ({ ...p, selected: true })),
  looks: SURAT_REGIONAL_PRESET.looks,
  checklist: SURAT_REGIONAL_PRESET.checklist,
  notes: 'Evaluated plan for The Rustic Villa (Anand). Base venue fee is ₹25,000 + ₹3,000 per prop (horse, boat, car) adding ₹9,000+ extra. 4-hour drive from Surat.'
};

// Legacy presets kept for backwards compatibility
export const NATIONAL_PREWEDDING_PRESET = SURAT_REGIONAL_PRESET;
export const INTERNATIONAL_PREWEDDING_PRESET = SURAT_REGIONAL_PRESET;
export const REGIONAL_PREWEDDING_PRESET = SURAT_REGIONAL_PRESET;

export const INITIAL_PREWEDDING_PLAN = SURAT_REGIONAL_PRESET;
