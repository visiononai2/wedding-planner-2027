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
  PreWeddingChecklistItem
} from '../types/wedding';

export const INITIAL_MILESTONES: MonthMilestone[] = [
  { id: 'oct-2026', name: 'October 2026', monthLabel: 'Oct 2026', timeframe: 'Current Month (4 Mo to Go)', badge: 'Oct 2026: Core Dependencies' },
  { id: 'nov-2026', name: 'November 2026', monthLabel: 'Nov 2026', timeframe: '3 Months to Go', badge: 'Nov 2026: Outfits & Makeup' },
  { id: 'dec-2026', name: 'December 2026', monthLabel: 'Dec 2026', timeframe: '2 Months to Go', badge: 'Dec 2026: Catering & Staff' },
  { id: 'jan-2027', name: 'January 2027', monthLabel: 'Jan 2027', timeframe: '1 Month to Go', badge: 'Jan 2027: Chab & Envelopes' },
  { id: 'feb-prep', name: 'Feb 1 - 16, 2027', monthLabel: 'Feb 1-16', timeframe: 'Wedding Month Prep', badge: 'Feb 1-16: Final Fittings & ICER' },
  { id: 'feb-days', name: 'Feb 18 - 21, 2027', monthLabel: 'Feb 18-21', timeframe: 'Wedding Days', badge: 'Event Days: Randel, Mandvo, Garba & Jaan' }
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
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Kam - Ask about marriage together or separate.'
  },
  { 
    id: 't-oct-3', 
    title: 'Call Dhaval Jajenwala to get generator rental contact number', 
    category: 'rentals', 
    assignedTo: 'Groom', 
    side: 'Boy',
    monthId: 'oct-2026', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Get generator contact from dhaval, available on rent.'
  },
  { 
    id: 't-oct-4', 
    title: 'Pre-Wedding Shoot: Decide Trip Scope (National 2–3 Days in Udaipur/Goa vs International 1 Week in Dubai/Bali)', 
    category: 'outfits', 
    assignedTo: 'Both', 
    side: 'Both',
    monthId: 'oct-2026', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Photo graphy - find location (we find). Multi-day travel shoot, independent from Feb 18 home rituals.'
  },
  { 
    id: 't-oct-4b', 
    title: 'Shortlist Photography & Cinematography Crew with Drone for Pre-Wedding Shoot trip', 
    category: 'outfits', 
    assignedTo: 'Both', 
    side: 'Both',
    monthId: 'oct-2026', 
    completed: false, 
    priority: 'high',
    notes: 'Confirm package: 1 cinematic film, 2 Instagram reels, 40 edited photos, teaser, and Feb 20 Garba LED cut.'
  },
  { 
    id: 't-oct-5', 
    title: 'Check Silver Farm for dome availability vs constructing standalone mandvo', 
    category: 'venue', 
    assignedTo: 'Family', 
    side: 'Both',
    monthId: 'oct-2026', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: dome ma karvanu dome hoi to nakar mandvo banavano hoi.'
  },
  { 
    id: 't-oct-6', 
    title: 'Lock DJ & Sound package with Dhaval Jajenwala (Haldi ₹4k, Garba ₹24k, Jaan ICER ₹15k, Lagan ₹4k)', 
    category: 'sound_dj', 
    assignedTo: 'Groom', 
    side: 'Boy',
    monthId: 'oct-2026', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Dhaval jajenwala Silver ma karelu che 20, 21 feb 2027.'
  },

  // November 2026 (Outfits, Makeup & Pre-Wedding)
  { 
    id: 't-nov-1', 
    title: 'Groom: Buy Haldi kurta pajama (Blue / White / Lavender color theme)', 
    category: 'outfits', 
    assignedTo: 'Groom', 
    side: 'Boy',
    monthId: 'nov-2026', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: 20 saware haldi ma kurta payjama, blue theme, white, lavender.'
  },
  { 
    id: 't-nov-2', 
    title: 'Groom: Order or tailor Varghodo Jodhpuri / Suit (Feb 19 evening)', 
    category: 'outfits', 
    assignedTo: 'Groom', 
    side: 'Boy',
    monthId: 'nov-2026', 
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
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Bapore ghrah shanti traditional coty.'
  },
  { 
    id: 't-nov-5', 
    title: 'Bride: Book makeup parlour for Feb 20 (Strict morning slot: 11:00 AM – 12:00 PM start)', 
    category: 'outfits', 
    assignedTo: 'Bride', 
    side: 'Girl',
    monthId: 'nov-2026', 
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
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: GIRLS: Kapda, Mackup, Lagan - Lakhan, Vana - rasam, Mehndi, Geet gunjan.'
  },
  { 
    id: 't-nov-7', 
    title: 'Execute pre-wedding couple photoshoot at chosen location', 
    category: 'outfits', 
    assignedTo: 'Both', 
    side: 'Both',
    monthId: 'nov-2026', 
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
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: jamanvar = 2 or 3 -> caters nu round table (Optional).'
  },
  { 
    id: 't-dec-2', 
    title: 'Hire dedicated "Pani valo" (water distributor for hot daytime vidhis)', 
    category: 'catering', 
    assignedTo: 'Family', 
    side: 'Both',
    monthId: 'dec-2026', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Food: pani valo.'
  },
  { 
    id: 't-dec-3', 
    title: 'Arrange welcome drinks for guest arrival & nasta/snacks for Garba night', 
    category: 'catering', 
    assignedTo: 'Family', 
    side: 'Both',
    monthId: 'dec-2026', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: welcome drink, nasta = garba night.'
  },
  { 
    id: 't-dec-4', 
    title: 'Hire farm saf-safai crew for ongoing cleanliness at Silver Farm', 
    category: 'venue', 
    assignedTo: 'Family', 
    side: 'Both',
    monthId: 'dec-2026', 
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
    completed: false, 
    priority: 'medium',
    notes: 'Direct from user notes: Place: Farm, watchmen.'
  },
  { 
    id: 't-dec-6', 
    title: 'Confirm food servers (pirsava vala) and dish cleaners (vasan utkva vala)', 
    category: 'catering', 
    assignedTo: 'Family', 
    side: 'Both',
    monthId: 'dec-2026', 
    completed: false, 
    priority: 'medium',
    notes: 'Direct from user notes: pirsava vala, vasan utkva vala.'
  },
  { 
    id: 't-dec-7', 
    title: 'Book generator on rent from Dhaval\'s contact for farm sound & lighting backup', 
    category: 'rentals', 
    assignedTo: 'Groom', 
    side: 'Boy',
    monthId: 'dec-2026', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: DJ - generater, Get generator contact from dhaval, available on rent.'
  },

  // January 2027 (Rituals Preparation & Protocol Checks)
  { 
    id: 't-jan-1', 
    title: 'Prepare Chab Devani gift baskets (both sides exchange after Mandvo on Feb 20)', 
    category: 'rituals', 
    assignedTo: 'Both', 
    side: 'Both',
    monthId: 'jan-2027', 
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
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Close at 10 if police comes else till 12 AM.'
  },

  // February 1 - 16, 2027 (Final Prep & Fittings)
  { 
    id: 't-feb-1', 
    title: 'Final outfit fittings: Groom (Kurtas, Coty, Jodhpuri, Suits) & Bride (Chaniya Choli, Sarees)', 
    category: 'outfits', 
    assignedTo: 'Both', 
    side: 'Both',
    monthId: 'feb-prep', 
    completed: false, 
    priority: 'high',
    notes: 'Ensure all tailoring adjustments are completed before wedding week.'
  },
  { 
    id: 't-feb-2', 
    title: 'Confirm ICER truck assembly for 4:00 PM afternoon Jaan departure to Katargam (Feb 21)', 
    category: 'rentals', 
    assignedTo: 'Groom', 
    side: 'Boy',
    monthId: 'feb-prep', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Boy ne Bapor pachi jan leine javanu 4 wage, katargam farm thi one km away.'
  },
  { 
    id: 't-feb-3', 
    title: 'Girl side: Confirm Gor Maharaj exact date for Lagan Lakhan (17 or 18 Feb)', 
    category: 'rituals', 
    assignedTo: 'Bride', 
    side: 'Girl',
    monthId: 'feb-prep', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: 17 or 18 Feb (girl wala jyare lagan lakhvanu decide kare ena gor maharaj pase che).'
  },
  { 
    id: 't-feb-4', 
    title: 'Coordinate Joint Jamanvar (Dinner together on Feb 20, 6:00 - 6:30 PM)', 
    category: 'catering', 
    assignedTo: 'Family', 
    side: 'Both',
    monthId: 'feb-prep', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: jamanvar (boy and girl nu hare che 6-6:30 PM).'
  },

  // February 18 - 21, 2027 (Wedding Execution Days)
  { 
    id: 't-day-1', 
    title: 'Feb 18 08:00 AM: Randel Tedva at Groom home & welcome ~100 family guests', 
    category: 'rituals', 
    assignedTo: 'Family', 
    side: 'Boy',
    monthId: 'feb-days', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Sawar ma ran dal tedvana boy na ghare, Randel tedvanu: 8 AM.'
  },
  { 
    id: 't-day-2', 
    title: 'Feb 18 10:00 AM: Gor Maharaj completes Lagan Lakhan at Bride house', 
    category: 'rituals', 
    assignedTo: 'Bride', 
    side: 'Girl',
    monthId: 'feb-days', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Gor maharaj girl na ghare lagan lakhavanu patave around 10-11 AM.'
  },
  { 
    id: 't-day-3', 
    title: 'Feb 18 11:00 AM: Bride brothers (5-6 people) deliver Lagan to Groom home; give shagun covers', 
    category: 'rituals', 
    assignedTo: 'Both', 
    side: 'Both',
    monthId: 'feb-days', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: pachi Lagan laine ave girl wala (pn girl nai, emna brothers) (5-6 people saman leine, boy side around 100 present hoi).'
  },
  { 
    id: 't-day-4', 
    title: 'Feb 18 12:00 PM: Boy side Jamanvar lunch (~100 guests)', 
    category: 'catering', 
    assignedTo: 'Family', 
    side: 'Boy',
    monthId: 'feb-days', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Boy ne emna meman ne jamadvana 12-1 PM.'
  },
  { 
    id: 't-day-5', 
    title: 'Feb 18 04:00 PM: Haldi Rasam at Groom home & Groom visits Bride Mehndi for photos', 
    category: 'rituals', 
    assignedTo: 'Both', 
    side: 'Both',
    monthId: 'feb-days', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Haldi Rasam : 4 Wage, meman ne 4 wage bolavana / Girls wala Mehndi Rakhe tya boy ne one two friends leine phota padva javanu.'
  },
  { 
    id: 't-day-6', 
    title: 'Feb 18 06:00 PM: Evening Jamanvar (Dinner for guests, Bride side has more guests)', 
    category: 'catering', 
    assignedTo: 'Family', 
    side: 'Both',
    monthId: 'feb-days', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Sanj Jamanvar : 6-7 Wage, girl side tyre meman pn vadhare hase.'
  },
  { 
    id: 't-day-7', 
    title: 'Feb 20 11:00 AM: Bride Parlour slot starts strictly between 11 AM - 12 PM', 
    category: 'outfits', 
    assignedTo: 'Bride', 
    side: 'Girl',
    monthId: 'feb-days', 
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
    pickupDate: '2027-02-18',
    pickupTime: '03:30 PM',
    dropDate: '2027-02-18',
    dropTime: '08:00 PM',
    pickupLocation: 'Groom Residence Courtyard',
    totalCost: 4000,
    advancePaid: 0,
    securityDeposit: 0,
    status: 'Reserved',
    side: 'Boy',
    notes: 'Direct from user notes: Haldi: 2 base 2 top. Rate 4000. One operator for sound. Haldi starts at 4 PM.'
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
    date: 'Feb 18, 2027 Morning',
    person: 'Groom',
    garmentName: 'Traditional Cotton Kurta Pajama',
    colorTheme: 'Traditional auspicious',
    action: 'Buy',
    status: 'To Buy',
    costEstimated: 0,
    advancePaid: 0,
    notes: 'Direct from user notes: Sawar ma ran dal tedvana boy na ghare, 18 feb event.'
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
    event: 'Haldi Rasam & Photo Visit to Mehndi',
    date: 'Feb 18, 2027 04:00 PM',
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
    date: 'Feb 18, 2027 10:00 AM',
    person: 'Bride',
    garmentName: 'Traditional Ceremony Saree / Outfit',
    colorTheme: 'Traditional auspicious',
    action: 'Buy',
    status: 'To Buy',
    costEstimated: 0,
    advancePaid: 0,
    notes: 'Direct from user notes: Gor maharaj girl na ghare lagan lakhavanu patave around 10-11 AM.'
  },
  {
    id: 'dr-8',
    event: 'Mehndi Rasam & Couple Photoshoot',
    date: 'Feb 18, 2027 04:30 PM',
    person: 'Bride',
    garmentName: 'Mehndi Outfit',
    colorTheme: 'Green / Festive bright',
    action: 'Buy',
    status: 'To Buy',
    costEstimated: 0,
    advancePaid: 0,
    notes: 'Direct from user notes: Girls wala Mehndi Rakhe tya boy ne one two friends leine phota padva javanu.'
  },
  {
    id: 'dr-9',
    event: 'Haldi Rasam',
    date: 'Feb 18, 2027',
    person: 'Bride',
    garmentName: 'Haldi Outfit',
    colorTheme: 'Yellow / Lavender / White theme',
    action: 'Buy',
    status: 'To Buy',
    costEstimated: 0,
    advancePaid: 0,
    notes: 'Match Blue/White/Lavender palette.'
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
    id: 'feb-18',
    dateString: '2027-02-18',
    dayName: 'Thursday / 18 Feb (17 or 18 Feb)',
    title: 'Lagan Lakhan, Haldi & Home Rituals',
    location: 'Groom & Bride Respective Homes',
    items: [
      {
        id: 's-18-1',
        time: '08:00 AM',
        title: 'Randel Tedva (Groom Home)',
        gujaratiTitle: 'સવારમાં રાંદલ તેડવા (છોકરાના ઘરે - ૮ વાગે)',
        location: 'Groom Residence',
        actionNotes: 'Auspicious Randel sthapana and invocation at Groom\'s residence in the morning.',
        side: 'Boy',
        outfitGroom: 'Traditional Cotton Kurta'
      },
      {
        id: 's-18-2',
        time: '10:00 AM – 11:00 AM',
        title: 'Lagan Lakhavanu (Bride Home with Gor Maharaj)',
        gujaratiTitle: 'લગ્ન લખાણ (દીકરીના ઘરે ગોર મહારાજ સાથે - ૧૦ થી ૧૧ વાગે)',
        location: 'Bride Residence',
        actionNotes: 'Gor Maharaj completes auspicious Lagan Lakhan writing rituals at Bride\'s house.',
        side: 'Girl',
        outfitBride: 'Traditional Bandhani'
      },
      {
        id: 's-18-3',
        time: '11:00 AM – 12:00 PM',
        title: 'Lagan Delivery to Groom Home (Bride\'s Brothers)',
        gujaratiTitle: 'લગ્ન લઈને આવવું (દીકરીના ભાઈઓ ૫-૬ જણા સામાન લઈને આવે, છોકરા પક્ષે ~૧૦૦ હાજર)',
        location: 'Groom Residence',
        actionNotes: '5 to 6 brothers of Bride arrive carrying Lagan patrika and ritual saman. Around 100 boy side relatives present. Give shagun covers and hospitality to brothers before they return.',
        side: 'Both'
      },
      {
        id: 's-18-4',
        time: '12:00 PM – 01:00 PM',
        title: 'Boy Side Lunch Feast (Jamanvar)',
        gujaratiTitle: 'બપોરે જમણવાર (૧૨ થી ૧ વાગે - ૧૦૦ મહેમાન)',
        location: 'Groom Residence Dining',
        actionNotes: 'Celebratory feast served to ~100 family members and guests at Groom\'s home.',
        side: 'Boy'
      },
      {
        id: 's-18-5',
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
        id: 's-18-6',
        time: '04:30 PM – 05:30 PM',
        title: 'Mehndi Rasam & Groom Photo Visit',
        gujaratiTitle: 'મહેંદી રસમ અને ફોટોશૂટ (છોકરો ૧-૨ મિત્રો સાથે ફોટા પડાવવા જાય ને પાછો આવે)',
        location: 'Bride Residence / Mehndi Lawn',
        actionNotes: 'Bride side holds Mehndi. Groom visits with 1-2 close friends for couple photoshoot, clicks portraits, and returns back.',
        side: 'Both',
        urgentRule: 'Groom visits with 1-2 friends for photoshoot at Bride\'s venue, then returns for dinner!'
      },
      {
        id: 's-18-7',
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
    id: 'feb-20',
    dateString: '2027-02-20',
    dayName: 'Saturday / 20 Feb',
    title: 'Day 1: Parlour, Mandvo, Joint Dinner & Garba',
    location: 'Silver Farm, Surat',
    items: [
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
    title: 'Day 2: 4 PM Jaan to Katargam, Mandap, Lagan & Mandir',
    location: 'Katargam Venue (1 km from Farm)',
    items: [
      {
        id: 's-21-1',
        time: '03:30 PM',
        title: 'ICER Truck & Sound Rig Assembly at Groom Home',
        gujaratiTitle: 'આઈસર ટ્રક તૈયારી (બપોરે ૩:૩૦ વાગે)',
        location: 'Groom Residence',
        actionNotes: 'ICER truck mounted with 4 Base 4 Top, C-truss & floral decoration arrives at Groom residence.',
        side: 'Boy',
        soundRig: 'ICER Truck 4 Base 4 Top + C-truss & flowers (₹15,000)'
      },
      {
        id: 's-21-2',
        time: '04:00 PM',
        title: 'JAAN DEPARTURE TO KATARGAM (Afternoon 4 PM Sharp)',
        gujaratiTitle: 'જાન લઈને જવું (બપોર પછી ૪ વાગે - કતારગામ, ફાર્મથી ૧ કિમી)',
        location: 'Groom Residence to Katargam Venue',
        actionNotes: 'Boy side leaves with Jaan at 4:00 PM in the afternoon! Venue is in Katargam, 1 km away from farm.',
        side: 'Boy',
        urgentRule: 'Boy leaves with Jaan at 04:00 PM afternoon sharp!',
        outfitGroom: 'Lagan Wedding Suit'
      },
      {
        id: 's-21-3',
        time: '05:30 PM',
        title: 'Grand Entry Event at Katargam Venue',
        gujaratiTitle: 'એન્ટ્રી ઈવેન્ટ અને પોંખણું (સાંજે ૫:૩૦)',
        location: 'Katargam Venue Entrance',
        actionNotes: 'Groom entry & welcoming rituals (Pokhvanu) by Bride\'s mother and elders.',
        side: 'Both'
      },
      {
        id: 's-21-4',
        time: '06:30 PM',
        title: 'Mandap Sthapana & Besi Javanu',
        gujaratiTitle: 'મંડપમાં બેસી જવું અને વરમાળા (સાંજે ૬:૩૦)',
        location: 'Katargam Mandap',
        actionNotes: 'Groom and Bride take their seats in the sacred wedding Mandap. Varmala and auspicious rituals begin.',
        side: 'Both',
        soundRig: '2 Base 2 Top (₹4,000, slow music / lagan geet)'
      },
      {
        id: 's-21-5',
        time: '07:30 PM – 11:30 PM',
        title: 'Hastamelap, Phere, Kanyadaan & Wedding Jamanvar',
        gujaratiTitle: 'હસ્તમેળાપ, ફેરા અને લગ્ન જમણવાર',
        location: 'Katargam Mandap & Dining',
        actionNotes: 'Sacred Phere, Saptapadi, Kanyadaan rituals, followed by wedding dinner for guests.',
        side: 'Both'
      },
      {
        id: 's-21-6',
        time: '12:00 AM (Midnight)',
        title: 'Lagan Completes & Mandir Darshan (Visit Temple)',
        gujaratiTitle: 'લગ્ન ૧૨ વાગે પતે એટલે મંદિરે જઈ આવવું અને આશીર્વાદ લેવા',
        location: 'Holy Temple (Mandir) & Home',
        actionNotes: 'Wedding rituals complete around 12:00 AM midnight. The newlywed couple visits a holy temple (Mandir e jay avanu) for blessings, followed by Vidai!',
        side: 'Both',
        urgentRule: 'Once Lagan completes around 12 AM midnight, couple visits temple (mandir) together!'
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
    question: 'Girl side: Confirm Gor Maharaj decision date for Lagan Lakhan (17 or 18 Feb)?',
    options: ['17 February', '18 February'],
    status: 'Pending',
    decision: '',
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
    title: '17/18 Feb Home Rituals: Randel, Lagan Lakhan, Haldi & Mehndi',
    category: 'Rituals & Traditions',
    side: 'Both',
    content: `• Date: 17 or 18 Feb (Gor Maharaj at Girl's house decides exact date):
• 08:00 AM: Randel Tedva at Boy's house in morning.
• 10:00 - 11:00 AM: Gor Maharaj finishes Lagan Lakhan writing at Girl's house.
• 11:00 AM - 12:00 PM: Girl's brothers (5-6 people) bring Lagan and ritual saman to Boy's house. Boy side has around 100 family members present. Give shagun covers and send brothers back.
• 12:00 - 01:00 PM: Boy side Jamanvar lunch served to ~100 guests at home.
• 04:00 PM: Haldi Rasam for Groom (guests invited for 4:00 PM).
• 04:30 - 05:30 PM: Girl side hosts Mehndi. Groom visits with 1-2 friends for couple photoshoot, clicks portraits, and returns back.
• 06:00 - 07:00 PM: Evening Jamanvar dinner for guests (Girl side will have more guests present).`,
    pinned: true,
    tags: ['18 Feb', 'Randel', 'Lagan Lakhan', 'Haldi', 'Mehndi'],
    updatedAt: '2026-10-22'
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
    title: '21 Feb Schedule: 4 PM Jaan to Katargam, Mandap & Mandir',
    category: 'Rituals & Traditions',
    side: 'Boy',
    content: `• 03:30 PM: ICER truck with 4 Base 4 Top, C-truss, sound operator & flowers ready at Groom home.
• 04:00 PM (Afternoon): Boy side leaves with Jaan to Katargam (1 km away from farm)!
• 05:30 PM: Grand Entry event at Katargam venue.
• 06:30 PM: Mandap ma besi javanu (sitting in Mandap) & Varmala.
• 07:30 PM - 11:30 PM: Hastamelap, Phere, Kanyadaan & Wedding dinner feast.
• 12:00 AM (Midnight): Lagan vidhi finishes around 12:00 AM -> Mandir e jay avanu (Couple visits temple together for blessings).`,
    pinned: true,
    tags: ['21 Feb', '4 PM Jaan', 'Katargam', 'Lagan', 'Mandir'],
    updatedAt: '2026-10-22'
  },
  {
    id: 'note-4',
    title: 'Sound System Rig, DJ & Lighting (Dhaval Jajenwala & Silver Farm)',
    category: 'Sound & Technical',
    side: 'Boy',
    content: `• Haldi (Feb 18, 4 PM): 2 Base, 2 Top. Rate ₹4,000 with 1 sound operator.
• Sangeet / Garba Night (Feb 20, 8 PM): Rate ₹24,000. 6 Base, 6 Top, 16 LED small round lights, 6 Safi (white floodlights), 4 battle top lights. 1 sound operator + 1 lighting operator.
• Truss & Structure: 40ft length C-truss structure + top square ring. 6 Base 6 Top is plenty of punch for 500–800 guests at Silver Farm.
• Police 10 PM Curfew: Turn down high decibel sound at 10:00 PM if police comes, else till 12:00 AM.
• Jaan (Feb 21 04:00 PM): Need ICER truck with 4 Base, 4 Top, sound operator, C-truss & floral decoration. Total ₹15,000.
• Lagan (Feb 21 06:30 PM - 12 AM): 2 Base, 2 Top. Rate ₹4,000 with 1 operator (slow music / lagan geet).
• Generator: Available on rent. Get vendor contact number directly from Dhaval Jajenwala.`,
    pinned: false,
    tags: ['Dhaval Jajenwala', 'DJ', 'Truss', 'ICER'],
    updatedAt: '2026-10-22'
  },
  {
    id: 'note-5',
    title: 'Two-Sided Coordination (Boy\'s Side & Girl\'s Side Tracking)',
    category: 'Family & Fiance',
    side: 'Both',
    content: `• Groom & Bride Joint Workflow:
  - Both partners track preparations collaboratively using the "Boy's Side" and "Girl's Side" switcher.
  - Boy side tracks: Randel (8 AM), Lagan reception (~100 guests), Boy Haldi (4 PM), 4 PM Jaan to Katargam.
  - Girl side tracks: Gor Maharaj Lagan Lakhan (10-11 AM), brothers sending Lagan, Parlour (11 AM), Mehndi (4 PM), Mandap.
  - Joint coordination: Feb 20 Mandvo at 2 PM, Joint Jamanvar (dinner together at 6 PM), Raas Garba (8 PM), 12 AM temple visit.`,
    pinned: true,
    tags: ['Boy Side', 'Girl Side', 'Fiance Coordination'],
    updatedAt: '2026-10-22'
  }
];


// Pre-Wedding Shoot Presets & Initial State
export const NATIONAL_PREWEDDING_PRESET: PreWeddingTripPlan = {
  tripType: 'NATIONAL',
  destination: 'Udaipur, Rajasthan (Lake Pichola & Heritage Palaces) OR Goa Beach',
  durationLabel: '2–3 Days Trip',
  targetDates: 'Dec 11 – Dec 14, 2026',
  flightStatus: 'To Book',
  hotelStatus: 'To Book',
  passportVisaStatus: 'Not Needed',
  photographerAgency: 'To Book (Candid + Cinematography + Drone)',
  contactPerson: 'Lead Cinematographer',
  phone: '',
  crewCount: 3,
  totalEstimatedCost: 150000,
  advancePaid: 0,
  deliverables: [
    '1 Cinematic Pre-Wedding Film (3-4 mins 4K with custom music soundtrack)',
    '2 Instagram Reels (9:16 vertical cuts for social media announcements)',
    '40-50 Color-graded High-Res Master Photos (framed portraits & digital)',
    '1 Teaser Trailer (30-45s) for Save-The-Date digital invitations',
    'Full HD Landscape Cut formatted for LED Wall display on Feb 20 Garba Night'
  ],
  looks: [
    {
      id: 'pw-look-1',
      themeTitle: 'Royal Heritage / Palace Elegance',
      groomOutfit: 'Royal Navy / Emerald Jodhpuri Bandhgala Suit with pocket square & formal shoes',
      brideOutfit: 'Heavy Embroidered Royal Heritage Lehenga / Anarkali with royal dupatta',
      locationBackdrop: 'Heritage palace courtyards, grand archways, marble jharokhas, or fort walls',
      status: 'Planning'
    },
    {
      id: 'pw-look-2',
      themeTitle: 'Western Glamour & Golden Hour Sunset',
      groomOutfit: 'Classic Black Tuxedo with bowtie or sleek Charcoal 3-piece Suit',
      brideOutfit: 'Dramatic Evening Gown / Satin Silk Trail Dress in wine red or emerald',
      locationBackdrop: 'Lakeside sunset, rooftop infinity pool, or palace terrace at twilight',
      status: 'Planning'
    },
    {
      id: 'pw-look-3',
      themeTitle: 'Breezy Romantic / Casual Chic',
      groomOutfit: 'Pastel Linen shirt (Sky Blue / White / Sage), slim chinos, loafers',
      brideOutfit: 'Flowy floral sundress, pastel resort-wear, or chic co-ord set',
      locationBackdrop: 'Lake promenade, scenic waterfront, blooming gardens, or desert dunes',
      status: 'Planning'
    },
    {
      id: 'pw-look-4',
      themeTitle: 'Contemporary Coordinated / Cinematic Night',
      groomOutfit: 'Smart casual layered blazer or textured knit with dark trousers',
      brideOutfit: 'Modern draped saree / contemporary Indo-western fusion gown',
      locationBackdrop: 'Fairy lights night installation, candle-lit courtyard, or boat cruise',
      status: 'Planning'
    }
  ],
  checklist: [
    {
      id: 'pw-chk-1',
      stage: 'Scope & Destination',
      title: 'Decide Trip Scope: National (2-3 days in Udaipur/Goa) vs International (1 week in Dubai/Bali)',
      completed: false,
      notes: 'Evaluate leave availability, budget, flight travel times, and photography permits.'
    },
    {
      id: 'pw-chk-2',
      stage: 'Scope & Destination',
      title: 'Shortlist top 2 destination choices & check seasonal weather / photography permit guidelines',
      completed: false,
      notes: 'Dec / Jan is peak pleasant weather for Rajasthan, Goa, and UAE.'
    },
    {
      id: 'pw-chk-3',
      stage: 'Photography Crew',
      title: 'Interview & book Photography + Cinematography crew (Lead shooter, Cinematographer, Drone pilot)',
      completed: false,
      notes: 'Ensure drone camera permits are handled by the crew in designated zones.'
    },
    {
      id: 'pw-chk-4',
      stage: 'Photography Crew',
      title: 'Confirm deliverable package: 1 cinematic film, 2 reels, 40 photos, 1 teaser, and Garba LED cut',
      completed: false,
      notes: 'Lock turnaround times: Teaser within 10 days, full video before mid-January.'
    },
    {
      id: 'pw-chk-5',
      stage: 'Travel & Lodging',
      title: 'Book return flight / train tickets for Couple and photography team',
      completed: false,
      notes: 'Coordinate baggage allowances for camera gear, drone batteries, and wedding gowns.'
    },
    {
      id: 'pw-chk-6',
      stage: 'Travel & Lodging',
      title: 'Book picturesque heritage resort / villa with shoot permissions included in room stay',
      completed: false,
      notes: 'Many palace hotels include courtyard shooting rights for resident guests.'
    },
    {
      id: 'pw-chk-7',
      stage: 'Travel & Lodging',
      title: 'Arrange dedicated local SUV / transportation for moving props and gear between locations',
      completed: false,
      notes: 'Allows fast outfit changes on location.'
    },
    {
      id: 'pw-chk-8',
      stage: 'Wardrobe & Styling',
      title: 'Curate and buy/tailor 4 distinct looks for Groom & Bride (Royal, Western Gown/Tux, Casual, Modern)',
      completed: false,
      notes: 'Steam iron outfits in advance; pack portable garment steamer.'
    },
    {
      id: 'pw-chk-9',
      stage: 'Wardrobe & Styling',
      title: 'Book travel Makeup Artist & Hair Stylist (or pack comprehensive travel bridal vanity kit)',
      completed: false,
      notes: 'Waterproof makeup essential for outdoor and humid shoots.'
    },
    {
      id: 'pw-chk-10',
      stage: 'Shoot Execution',
      title: 'Execute Pre-Wedding Shoot Trip: Golden hour shoots, drone sweeps, and romantic candid clips',
      completed: false,
      notes: 'Schedule early morning 6:30 AM sunrise shoot to beat crowds!'
    },
    {
      id: 'pw-chk-11',
      stage: 'Post-Production',
      title: 'Review raw photo proofs and shortlist 40 master photos for retouching and album',
      completed: false,
      notes: 'Select photos for digital Save-The-Date cards and Instagram announcements.'
    },
    {
      id: 'pw-chk-12',
      stage: 'Post-Production',
      title: 'Receive edited Pre-Wedding Teaser video and share digital wedding invitation with family',
      completed: false,
      notes: 'Deliver before Jan 15 for digital distribution.'
    },
    {
      id: 'pw-chk-13',
      stage: 'Post-Production',
      title: 'Receive 4K horizontal master cut ready for projection on Feb 20 Raas-Garba night LED screen',
      completed: false,
      notes: 'Hand over file to Dhaval Jajenwala\'s LED wall operator at Silver Farm!'
    }
  ],
  notes: 'Pre-wedding shoot is an independent multi-day trip planned for Nov/Dec 2026. Totally distinct from Feb 18 home rituals (Randel, Lagan Lakhan, Haldi & Mehndi).'
};

export const INTERNATIONAL_PREWEDDING_PRESET: PreWeddingTripPlan = {
  tripType: 'INTERNATIONAL',
  destination: 'Dubai, UAE (Desert Safari, Downtown Skyline & Luxury Yacht) OR Bali, Indonesia',
  durationLabel: '1 Week / 5–7 Days Trip',
  targetDates: 'Nov 25 – Dec 02, 2026',
  flightStatus: 'To Book',
  hotelStatus: 'To Book',
  passportVisaStatus: 'Check Validity',
  photographerAgency: 'To Book (Destination Specialist Crew)',
  contactPerson: 'Lead Destination Photographer',
  phone: '',
  crewCount: 3,
  totalEstimatedCost: 320000,
  advancePaid: 0,
  deliverables: [
    '1 Cinematic Pre-Wedding Film (4-5 mins 4K with international landscape & aerial drone cuts)',
    '3 Instagram Reels (9:16 vertical 4K edits)',
    '50 Color-graded Master Photos (High-res print & digital)',
    '1 Teaser Trailer (45s) for Save-The-Date cards',
    'Full 4K Horizontal Cut for Feb 20 Raas-Garba LED screen projection'
  ],
  looks: [
    {
      id: 'pw-intl-1',
      themeTitle: 'Desert Dunes & Sunset Romance',
      groomOutfit: 'Breezy Linen suit or crisp white open-collar shirt with camel trousers',
      brideOutfit: 'Flying red trail dress / flowing chiffon gown with dramatic wind sweep',
      locationBackdrop: 'Red sand dunes at sunset, camel safari camp, or desert resort oasis',
      status: 'Planning'
    },
    {
      id: 'pw-intl-2',
      themeTitle: 'Metropolitan Luxury / Evening Skyline',
      groomOutfit: 'Tailored Black Tuxedo with satin lapel & cufflinks',
      brideOutfit: 'Sparkling cocktail evening gown or high-slit metallic gown',
      locationBackdrop: 'Dubai Marina rooftop, illuminated Burj Khalifa skyline, or private yacht',
      status: 'Planning'
    },
    {
      id: 'pw-intl-3',
      themeTitle: 'Beachfront / Resort Tropical Glam',
      groomOutfit: 'Pastel resort-wear polo / linen shirt & espadrilles',
      brideOutfit: 'Boho chic crochet maxi dress or tropical resort co-ord',
      locationBackdrop: 'Private beach cabana, infinity pool edge, or cliffside coastline',
      status: 'Planning'
    },
    {
      id: 'pw-intl-4',
      themeTitle: 'Royal Traditional Heritage',
      groomOutfit: 'Handcrafted Indo-Western Bandhgala in royal beige / ivory gold',
      brideOutfit: 'Rich pastel embroidered designer lehenga',
      locationBackdrop: 'Traditional Arabic palace courtyard / heritage souk architecture',
      status: 'Planning'
    }
  ],
  checklist: [
    {
      id: 'pw-intl-chk-1',
      stage: 'Scope & Destination',
      title: 'Confirm Passports have minimum 6 months validity from travel date',
      completed: false,
      notes: 'Check both Groom and Bride passports immediately.'
    },
    {
      id: 'pw-intl-chk-2',
      stage: 'Scope & Destination',
      title: 'Apply for tourist e-visas (Dubai 30-day visa / Bali VoA)',
      completed: false,
      notes: 'Takes 3-5 working days.'
    },
    {
      id: 'pw-intl-chk-3',
      stage: 'Travel & Lodging',
      title: 'Book international flight tickets (Surat/Ahmedabad/Mumbai to destination)',
      completed: false,
      notes: 'Coordinate crew baggage for heavy lenses and gimbal gear.'
    },
    {
      id: 'pw-intl-chk-4',
      stage: 'Travel & Lodging',
      title: 'Book 5–7 nights hotel/resort stay + private luxury yacht / desert safari camp charter',
      completed: false,
      notes: 'Charter 2-hour private yacht for sunset golden hour shoot.'
    },
    {
      id: 'pw-intl-chk-5',
      stage: 'Photography Crew',
      title: 'Contract destination cinema crew & verify commercial drone flying permissions',
      completed: false,
      notes: 'Verify local UAE GCAA or Indonesian drone laws.'
    },
    {
      id: 'pw-intl-chk-6',
      stage: 'Wardrobe & Styling',
      title: 'Pack 4-5 luxury looks including flying dress, tuxedo, and beachwear',
      completed: false,
      notes: 'Pack portable steamer and safety pins.'
    },
    {
      id: 'pw-intl-chk-7',
      stage: 'Shoot Execution',
      title: 'Execute 5-7 days international pre-wedding shoot & holiday trip!',
      completed: false,
      notes: 'Combine couple leisure time with scheduled morning and sunset shoot slots.'
    },
    {
      id: 'pw-intl-chk-8',
      stage: 'Post-Production',
      title: 'Deliver Save-the-Date video trailer and final 4K cut for Feb 20 Garba LED wall',
      completed: false,
      notes: 'Ensure files delivered by Jan 15 for invitations.'
    }
  ],
  notes: '1-week international pre-wedding travel experience. Combines photoshoot with couple getaway in Nov/Dec 2026.'
};

export const REGIONAL_PREWEDDING_PRESET: PreWeddingTripPlan = {
  tripType: 'REGIONAL',
  destination: 'Vadodara (Laxmi Vilas Palace), Dumas Coastline & Surat Film City Studios',
  durationLabel: '1–2 Days Trip',
  targetDates: 'Dec 05 – Dec 06, 2026',
  flightStatus: 'Not Needed',
  hotelStatus: 'To Book',
  passportVisaStatus: 'Not Needed',
  photographerAgency: 'To Book (Local Surat/Gujarat Specialists)',
  contactPerson: 'Lead Photographer',
  phone: '',
  crewCount: 2,
  totalEstimatedCost: 65000,
  advancePaid: 0,
  deliverables: [
    '1 Cinematic Pre-Wedding Highlight Video (2-3 mins 4K)',
    '2 Instagram Reels (9:16 vertical cuts)',
    '30-40 Color-graded High-Res Master Photos',
    '1 Teaser Trailer for digital invitation cards',
    'Full HD Landscape Cut for Feb 20 Garba LED screen'
  ],
  looks: [
    {
      id: 'pw-reg-1',
      themeTitle: 'Royal Palace Heritage',
      groomOutfit: 'Regal Bandhgala / Jodhpuri',
      brideOutfit: 'Heritage Royal Lehenga',
      locationBackdrop: 'Laxmi Vilas Palace grounds / Champaner stepwell',
      status: 'Planning'
    },
    {
      id: 'pw-reg-2',
      themeTitle: 'Western Glamour Sunset',
      groomOutfit: 'Tailored Blazer with crisp shirt',
      brideOutfit: 'Evening Gown',
      locationBackdrop: 'Dumas coast golden hour or luxury hotel terrace',
      status: 'Planning'
    },
    {
      id: 'pw-reg-3',
      themeTitle: 'Film Studio Set Variety',
      groomOutfit: 'Casual chic jacket / shirt',
      brideOutfit: 'Trendy fusion dress',
      locationBackdrop: 'European street / Santorini sets at photography film city',
      status: 'Planning'
    }
  ],
  checklist: [
    {
      id: 'pw-reg-chk-1',
      stage: 'Scope & Destination',
      title: 'Book photography slots at Laxmi Vilas Palace / Surat set studio',
      completed: false,
      notes: 'Pay photography entry camera fee.'
    },
    {
      id: 'pw-reg-chk-2',
      stage: 'Wardrobe & Styling',
      title: 'Finalize 3 coordinated looks for Groom & Bride',
      completed: false,
      notes: 'Prepare vanity makeup kit.'
    },
    {
      id: 'pw-reg-chk-3',
      stage: 'Shoot Execution',
      title: 'Complete 1-2 days shoot schedule across heritage and set locations',
      completed: false,
      notes: 'Quick weekend shoot without long-distance flights.'
    },
    {
      id: 'pw-reg-chk-4',
      stage: 'Post-Production',
      title: 'Receive teaser video and Garba LED screen master cut',
      completed: false,
      notes: 'Ready for Save-the-date cards.'
    }
  ],
  notes: 'Budget-friendly 1-2 days regional Gujarat shoot with minimal travel fatigue.'
};

export const INITIAL_PREWEDDING_PLAN = NATIONAL_PREWEDDING_PRESET;
