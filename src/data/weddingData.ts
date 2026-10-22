import { 
  MonthMilestone, 
  Task, 
  RentalItem, 
  DressItem, 
  EventDaySchedule,
  DecisionPoint,
  PlanningNote 
} from '../types/wedding';

export const INITIAL_MILESTONES: MonthMilestone[] = [
  { id: 'oct-2026', name: 'October 2026', monthLabel: 'Oct 2026', timeframe: 'Current Month (4 Mo to Go)', badge: 'Oct 2026: Core Dependencies' },
  { id: 'nov-2026', name: 'November 2026', monthLabel: 'Nov 2026', timeframe: '3 Months to Go', badge: 'Nov 2026: Outfits & Makeup' },
  { id: 'dec-2026', name: 'December 2026', monthLabel: 'Dec 2026', timeframe: '2 Months to Go', badge: 'Dec 2026: Catering & Staff' },
  { id: 'jan-2027', name: 'January 2027', monthLabel: 'Jan 2027', timeframe: '1 Month to Go', badge: 'Jan 2027: Chab & Envelopes' },
  { id: 'feb-prep', name: 'Feb 1 - 18, 2027', monthLabel: 'Feb 1-18', timeframe: 'Wedding Month Prep', badge: 'Feb 1-18: Final Fittings & ICER' },
  { id: 'feb-days', name: 'Feb 19 - 21, 2027', monthLabel: 'Feb 19-21', timeframe: 'Wedding Days', badge: 'Event Days: Mandvo, Garba & Jaan' }
];

export const INITIAL_TASKS: Task[] = [
  // October 2026 (Current Month - Real Dependencies from Notes)
  { 
    id: 't-oct-1', 
    title: 'Ask elders: Annual function in first half or second half?', 
    category: 'rituals', 
    assignedTo: 'Family', 
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
    monthId: 'oct-2026', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Get generator contact from dhaval, available on rent.'
  },
  { 
    id: 't-oct-4', 
    title: 'Find location for couple pre-wedding photoshoot', 
    category: 'outfits', 
    assignedTo: 'Both', 
    monthId: 'oct-2026', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Photo graphy - find location (we find).'
  },
  { 
    id: 't-oct-5', 
    title: 'Check Silver Farm for dome availability vs constructing standalone mandvo', 
    category: 'venue', 
    assignedTo: 'Family', 
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
    monthId: 'nov-2026', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: 21 lagan ma suit.'
  },
  { 
    id: 't-nov-4', 
    title: 'Groom: Buy traditional coty (bandi) & kurta for Grah Shanti (Feb 20 noon)', 
    category: 'outfits', 
    assignedTo: 'Groom', 
    monthId: 'nov-2026', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Bapore ghrah shanti traditional coty.'
  },
  { 
    id: 't-nov-5', 
    title: 'Bride: Book makeup parlour for Feb 20 (Strict slot: start 2-3 PM, finish by 4-5-6 PM)', 
    category: 'outfits', 
    assignedTo: 'Bride', 
    monthId: 'nov-2026', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: parlour, tayar thavanu, 2-3-4 pm e chalu thay ne 4-5-6 wage pati jay.'
  },
  { 
    id: 't-nov-6', 
    title: 'Bride: Finalize wedding clothes (Lagan-Lakhan, Mehndi, Haldi, Mandvo, Garba chaniya choli, Lagan)', 
    category: 'outfits', 
    assignedTo: 'Bride', 
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
    monthId: 'dec-2026', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: DJ - generater, Get generator contact from dhaval, available on rent.'
  },

  // January 2027 (Rituals Preparation & Protocol Checks)
  { 
    id: 't-jan-1', 
    title: 'Prepare Chab Devani gift baskets (both sides exchange after Mandvo)', 
    category: 'rituals', 
    assignedTo: 'Both', 
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
    monthId: 'jan-2027', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: mandvo pate pachi paat utraman karvanu hoi, badha cover deva ave, boy ne boys wala side boy na mandvama besvanu ne girl ne girl side.'
  },
  { 
    id: 't-jan-3', 
    title: 'Confirm late-night Garba ice cream arrangement (joint counter or separate for each side)', 
    category: 'catering', 
    assignedTo: 'Both', 
    monthId: 'jan-2027', 
    completed: false, 
    priority: 'medium',
    notes: 'Direct from user notes: garba chelle icream hoi, garba bhega hoi to bhega, nakar pot potani tya icream.'
  },
  { 
    id: 't-jan-4', 
    title: 'Review 10:00 PM Surat police sound cutoff rule with Dhaval\'s sound operator', 
    category: 'sound_dj', 
    assignedTo: 'Both', 
    monthId: 'jan-2027', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: 10 wage function dj police bandh karavshe.'
  },

  // February 1 - 18, 2027 (Final Prep & Fittings)
  { 
    id: 't-feb-1', 
    title: 'Final outfit fittings: Groom (Kurtas, Coty, Jodhpuri, Suits) & Bride (Chaniya Choli, Sarees)', 
    category: 'outfits', 
    assignedTo: 'Both', 
    monthId: 'feb-prep', 
    completed: false, 
    priority: 'high',
    notes: 'Ensure all tailoring adjustments are completed before wedding week.'
  },
  { 
    id: 't-feb-2', 
    title: 'Confirm ICER truck assembly at 04:30 AM on Feb 21 with 4 Base 4 Top & flowers', 
    category: 'rentals', 
    assignedTo: 'Groom', 
    monthId: 'feb-prep', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Jan: Need icer, 4 base 4 top, One operator for sound, Upper walu thaine 15k, C trust and flowers for decoration.'
  },
  { 
    id: 't-feb-3', 
    title: 'Plan Bride Entry timing for Garba (half-time garba at peer side first, then arrival)', 
    category: 'rituals', 
    assignedTo: 'Both', 
    monthId: 'feb-prep', 
    completed: false, 
    priority: 'medium',
    notes: 'Direct from user notes: ras mate girl ne lei avine entry karava(girl half time garba ena peer ma karine ave).'
  },
  { 
    id: 't-feb-4', 
    title: 'Confirm slow music / sound system operator for Lagan geet & Varmala', 
    category: 'sound_dj', 
    assignedTo: 'Groom', 
    monthId: 'feb-prep', 
    completed: false, 
    priority: 'medium',
    notes: 'Direct from user notes: lagan geet / sound system (slow music), Lagan 2 base 2 top. Rate 4000.'
  },

  // February 19 - 21, 2027 (Wedding Execution Days)
  { 
    id: 't-day-1', 
    title: 'Feb 19 Morning: Conduct Lagan-Lakhan & Vana rasam at home (Traditional outfit)', 
    category: 'rituals', 
    assignedTo: 'Family', 
    monthId: 'feb-days', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Lagan - Lakhan, Vana - rasam, 19 saware traditional.'
  },
  { 
    id: 't-day-2', 
    title: 'Feb 19 Evening: Geet Gunjan ladies sangeet at home & Varghodo (Jodhpuri / Suit)', 
    category: 'rituals', 
    assignedTo: 'Family', 
    monthId: 'feb-days', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Geet gunjan at Home, Sanje varghodo jodhpuri jevu ka to suit.'
  },
  { 
    id: 't-day-3', 
    title: 'Feb 20 09:30 AM: Haldi rasam (Blue/White/Lavender Kurta, 2 Base 2 Top DJ sound rig)', 
    category: 'rituals', 
    assignedTo: 'Both', 
    monthId: 'feb-days', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Haldi: 2 base 2 top Rate 4000, kurta payjama blue theme, white, lavender.'
  },
  { 
    id: 't-day-4', 
    title: 'Feb 20 01:30 PM: Mandvo (Ganpati & Brahman puja, 2 hrs in dome) + Chab Devani + Paat Utraman', 
    category: 'rituals', 
    assignedTo: 'Family', 
    monthId: 'feb-days', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: Bapore pachi mandvo (ganpati, bhaman, ne vidhi, 2 kalak, dome ma karvanu dome hoi to nakar mandvo banavano hoi).'
  },
  { 
    id: 't-day-5', 
    title: 'Feb 20 02:00–05:30 PM: Bride parlour makeup & sunset couple photography shoot', 
    category: 'outfits', 
    assignedTo: 'Bride', 
    monthId: 'feb-days', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: parlour, tayar thavanu, 2-3-4 pm e chalu thay ne 4-5-6 wage pati jay, pachi phota pade, ne jamanvar karvanu.'
  },
  { 
    id: 't-day-6', 
    title: 'Feb 20 08:30 PM: Raas Garba (6x6 DJ rig, girl peer entry, stop high DJ @ 10 PM, ice cream @ 11:30 PM)', 
    category: 'sound_dj', 
    assignedTo: 'Both', 
    monthId: 'feb-days', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: ras garba karvana hare chelle sudhi ne 1 wage ghare, 10 wage police dj bandh karavshe, garba chelle icream.'
  },
  { 
    id: 't-day-7', 
    title: 'Feb 21 05:00 AM: Jaan leaves on ICER truck with 4 Base 4 Top sound', 
    category: 'logistics', 
    assignedTo: 'Groom', 
    monthId: 'feb-days', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: 21 feb 5 wage chokra wala jaan leine jay, Jan Need icer 4 base 4 top.'
  },
  { 
    id: 't-day-8', 
    title: 'Feb 21 09:30 AM: Lagan vidhi, Varmala, Phere (2 Base 2 Top slow music) & Wedding Lunch', 
    category: 'rituals', 
    assignedTo: 'Family', 
    monthId: 'feb-days', 
    completed: false, 
    priority: 'high',
    notes: 'Direct from user notes: varmala, lagan geet / sound system (slow music), Lagan 2 base 2 top Rate 4000, 21 lagan ma suit.'
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
    notes: 'Direct from user notes: Sangit 24,000, 6 base 6 top, 16 led, 6 safi, 4 battle top, 1 sound + 1 light operator, 40ft C-truss. 10 PM police curfew!'
  },
  {
    id: 'rent-3',
    item: 'ICER Truck for Jaan (4 Base 4 Top + C-Truss & Floral Decor)',
    vendor: 'ICER Transport & Sound (via Dhaval)',
    contactPerson: 'Truck Operator',
    phone: 'To confirm',
    pickupDate: '2027-02-20',
    pickupTime: '10:00 PM (for mounting)',
    dropDate: '2027-02-21',
    dropTime: '01:00 PM',
    pickupLocation: 'Groom Residence Assembly Point',
    totalCost: 15000,
    advancePaid: 0,
    securityDeposit: 0,
    status: 'Reserved',
    notes: 'Direct from user notes: Jan Need icer, 4 base 4 top, One operator for sound, Upper walu thaine 15k, C trust and flowers for decoration. Departs 05:00 AM sharp on Feb 21!'
  },
  {
    id: 'rent-4',
    item: 'Haldi Sound Rig (2 Base, 2 Top + 1 Operator)',
    vendor: 'Dhaval Jajenwala',
    contactPerson: 'Dhaval Jajenwala',
    pickupDate: '2027-02-20',
    pickupTime: '08:30 AM',
    dropDate: '2027-02-20',
    dropTime: '12:00 PM',
    pickupLocation: 'Silver Farm Lawn',
    totalCost: 4000,
    advancePaid: 0,
    securityDeposit: 0,
    status: 'Reserved',
    notes: 'Direct from user notes: Haldi: 2 base 2 top. Rate 4000. One operator for sound.'
  },
  {
    id: 'rent-5',
    item: 'Lagan Mandap Sound Rig (2 Base, 2 Top + 1 Operator)',
    vendor: 'Dhaval Jajenwala',
    contactPerson: 'Dhaval Jajenwala',
    pickupDate: '2027-02-21',
    pickupTime: '08:30 AM',
    dropDate: '2027-02-21',
    dropTime: '02:00 PM',
    pickupLocation: 'Silver Farm Mandap',
    totalCost: 4000,
    advancePaid: 0,
    securityDeposit: 0,
    status: 'Reserved',
    notes: 'Direct from user notes: Lagan: 2 base 2 top. Rate 4000. One operator for sound (slow music / lagan geet).'
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
    notes: 'Direct from user notes: jamanvar = 2 or 3 -> caters nu round table (Optional).'
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
    notes: 'Direct from user notes: dome ma karvanu dome hoi to nakar mandvo banavano hoi.'
  }
];

export const INITIAL_DRESSES: DressItem[] = [
  // Groom Outfits (Direct from user notes)
  {
    id: 'dr-1',
    event: 'Lagan-Lakhan & Vana Rasam',
    date: 'Feb 19, 2027 Morning',
    person: 'Groom',
    garmentName: 'Traditional Kurta Pajama',
    colorTheme: 'Traditional colors',
    action: 'Buy',
    status: 'To Buy',
    costEstimated: 0,
    advancePaid: 0,
    notes: 'Direct from user notes: 19 saware traditional.'
  },
  {
    id: 'dr-2',
    event: 'Varghodo & Geet Gunjan',
    date: 'Feb 19, 2027 Evening',
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
    event: 'Haldi Rasam',
    date: 'Feb 20, 2027 09:30 AM',
    person: 'Groom',
    garmentName: 'Haldi Kurta Pajama',
    colorTheme: 'Blue / White / Lavender theme',
    action: 'Buy',
    status: 'To Buy',
    costEstimated: 0,
    advancePaid: 0,
    notes: 'Direct from user notes: 20 saware haldi ma kurta payjama, blue theme, white, lavender.'
  },
  {
    id: 'dr-4',
    event: 'Mandvo & Grah Shanti',
    date: 'Feb 20, 2027 01:30 PM',
    person: 'Groom',
    garmentName: 'Traditional Coty (Bandi) & Kurta',
    colorTheme: 'Traditional festive shade',
    action: 'Tailor / Stitch',
    status: 'To Buy',
    costEstimated: 0,
    advancePaid: 0,
    notes: 'Direct from user notes: Bapore ghrah shanti traditional coty.'
  },
  {
    id: 'dr-5',
    event: 'Sangeet / DJ Night / Reception',
    date: 'Feb 20, 2027 08:30 PM',
    person: 'Groom',
    garmentName: 'Kurta Pajama OR Suit OR Shirt-Pant',
    colorTheme: 'Reception festive wear',
    action: 'Tailor / Stitch',
    status: 'To Buy',
    costEstimated: 0,
    advancePaid: 0,
    notes: 'Direct from user notes: Sanje reception suit ka to jodhpuri / Dj ma kurta pajama / 20 sanje shurt pent.'
  },
  {
    id: 'dr-6',
    event: 'Lagan Ceremony & Phere',
    date: 'Feb 21, 2027 09:30 AM',
    person: 'Groom',
    garmentName: 'Lagan Wedding Suit',
    colorTheme: 'Classic wedding suit',
    action: 'Tailor / Stitch',
    status: 'To Buy',
    costEstimated: 0,
    advancePaid: 0,
    notes: 'Direct from user notes: 21 lagan ma suit.'
  },

  // Bride Outfits (Direct from user notes)
  {
    id: 'dr-7',
    event: 'Lagan-Lakhan & Vana Rasam',
    date: 'Feb 19, 2027 Morning',
    person: 'Bride',
    garmentName: 'Traditional Ceremony Saree / Outfit',
    colorTheme: 'Traditional auspicious',
    action: 'Buy',
    status: 'To Buy',
    costEstimated: 0,
    advancePaid: 0,
    notes: 'Direct from user notes: GIRLS: Kapda, Lagan - Lakhan, Vana - rasam.'
  },
  {
    id: 'dr-8',
    event: 'Geet Gunjan at Home & Mehndi',
    date: 'Feb 19, 2027 Evening',
    person: 'Bride',
    garmentName: 'Mehndi / Sangeet Outfit',
    colorTheme: 'Green / Festive bright',
    action: 'Buy',
    status: 'To Buy',
    costEstimated: 0,
    advancePaid: 0,
    notes: 'Direct from user notes: GIRLS: Mehndi, Geet gunjan at Home.'
  },
  {
    id: 'dr-9',
    event: 'Haldi Rasam',
    date: 'Feb 20, 2027 09:30 AM',
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
    event: 'Mandvo & Chab Devani',
    date: 'Feb 20, 2027 01:30 PM',
    person: 'Bride',
    garmentName: 'Mandvo Traditional Wear',
    colorTheme: 'Traditional Gharchola / Silk',
    action: 'Buy',
    status: 'To Buy',
    costEstimated: 0,
    advancePaid: 0,
    notes: 'Direct from user notes: mando pate pachi eni chab devani hoi.'
  },
  {
    id: 'dr-11',
    event: 'Raas Garba Night',
    date: 'Feb 20, 2027 08:30 PM',
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
    event: 'Lagan Ceremony & Phere',
    date: 'Feb 21, 2027 09:30 AM',
    person: 'Bride',
    garmentName: 'Bridal Panetar / Wedding Saree',
    colorTheme: 'Traditional Red & White Panetar',
    action: 'Buy',
    status: 'To Buy',
    costEstimated: 0,
    advancePaid: 0,
    notes: 'Direct from user notes: Lagan ceremony phere.'
  }
];

export const INITIAL_DAY_SCHEDULES: EventDaySchedule[] = [
  {
    id: 'feb-19',
    dateString: '2027-02-19',
    dayName: 'Friday',
    title: 'Pre-Wedding Home Rituals',
    location: 'Home Courtyard',
    items: [
      {
        id: 's-19-1',
        time: '10:00 AM',
        title: 'Lagan-Lakhan & Vana Rasam',
        gujaratiTitle: 'લગ્ન લખણ અને વાણા રસમ',
        location: 'Home Sthapana',
        actionNotes: 'Auspicious Lagan-Lakhan writing & initial Vana rasam at home with elders.',
        outfitGroom: 'Traditional Kurta Pajama',
        outfitBride: 'Traditional Saree'
      },
      {
        id: 's-19-2',
        time: '07:30 PM',
        title: 'Geet Gunjan (Ladies Sangeet)',
        gujaratiTitle: 'ગીત ગુંજન (ઘરે ગીતો)',
        location: 'Home',
        actionNotes: 'Traditional wedding songs and sangeet with family at home.',
        outfitGroom: 'Jodhpuri Suit or Kurta'
      }
    ]
  },
  {
    id: 'feb-20',
    dateString: '2027-02-20',
    dayName: 'Saturday',
    title: 'Day 1: Mandvo, Haldi, Chab & 6x6 Garba',
    location: 'Silver Farm, Surat',
    items: [
      {
        id: 's-20-1',
        time: '09:30 AM',
        title: 'Haldi Rasam',
        gujaratiTitle: 'પીઠી અને હળદર રસમ',
        location: 'Silver Farm Lawn',
        actionNotes: 'Haldi vidhi with family. 2 Base 2 Top sound setup.',
        soundRig: '2 Base, 2 Top (Dhaval Jajenwala, ₹4,000, 1 operator)',
        outfitGroom: 'Haldi Kurta Pajama (Blue/White/Lavender)'
      },
      {
        id: 's-20-2',
        time: '01:30 PM',
        title: 'Mandvo Vidhi (Ganpati & Brahman Puja)',
        gujaratiTitle: 'માંડવો (ગણપતિ અને બ્રાહ્મણ વિધિ - ૨ કલાક)',
        location: 'Farm Dome (or Mandap)',
        actionNotes: '2 hours puja. Dome ma karvanu dome hoi to nakar mandvo banavano hoi.',
        soundRig: 'Soft background sound',
        outfitGroom: 'Traditional Coty (Bandi) & Kurta'
      },
      {
        id: 's-20-3',
        time: '03:30 PM',
        title: 'Chab Devani (Gift Exchange)',
        gujaratiTitle: 'છાબ દેવાની (બેય સાઈડ એકબીજાને)',
        location: 'Mandvo Area',
        actionNotes: 'Mando pate pachi eni chab devani hoi, bei side ek bija ne dei de.',
        outfitGroom: 'Traditional Coty & Kurta'
      },
      {
        id: 's-20-4',
        time: '04:00 PM',
        title: 'Paat Utraman (Shagun Envelope Gathering)',
        gujaratiTitle: 'પાટ ઉતરામણ (કવર દેવા આવે)',
        location: 'Respective Mandvos',
        actionNotes: 'Badha cover deva ave. Boy sits in boy mandvo; girl sits in girl mandvo.',
        outfitGroom: 'Traditional Coty & Kurta'
      },
      {
        id: 's-20-5',
        time: '02:00 PM – 05:30 PM',
        title: 'Bride Parlour & Prep',
        gujaratiTitle: 'પાર્લર તૈયારી (૨ થી ૫:૩૦ strictly)',
        location: 'Bridal Parlour / Green Room',
        actionNotes: 'Parlour tayar thavanu starts 2-3 PM, finishes strictly by 5:00-5:30 PM for sunset photos and dinner.',
        urgentRule: 'Must finish before 5:30 PM to allow sunset portraits before dinner & Garba!'
      },
      {
        id: 's-20-6',
        time: '06:30 PM',
        title: 'Sunset Couple Photoshoot & Jamanvar',
        gujaratiTitle: 'ફોટોશૂટ અને જમણવાર',
        location: 'Silver Farm Lawn & Dining Area',
        actionNotes: 'Portraits during golden hour, followed by Jamanvar with caterers round tables.',
        outfitGroom: 'Evening outfit / Suit'
      },
      {
        id: 's-20-7',
        time: '08:30 PM',
        title: 'Raas Garba Night Starts',
        gujaratiTitle: 'રાસ ગરબા (૬ બેઝ ૬ ટોપ)',
        location: 'Silver Farm Main Ground',
        actionNotes: 'Garba kicks off. Dhaval Jajenwala 6 Base 6 Top, 16 LED, 6 Safi white lights, 40ft C-truss.',
        soundRig: '6 Base 6 Top, 16 LED, 6 Safi, 40ft C-truss (₹24,000, 2 operators)'
      },
      {
        id: 's-20-8',
        time: '09:15 PM',
        title: 'Couple Entry & Bride Arrival',
        gujaratiTitle: 'કપલ એન્ટ્રી (દીકરી પિયરમાં અડધો સમય ગરબા કરીને આવે)',
        location: 'Silver Farm Ground',
        actionNotes: 'Girl does half-time garba at peer side first, then arrives for grand couple entry before 10 PM.',
        outfitGroom: 'Kurta pajama OR Reception suit'
      },
      {
        id: 's-20-9',
        time: '10:00 PM',
        title: 'SURAT POLICE SOUND CUTOFF',
        gujaratiTitle: '૧૦ વાગે પોલીસ DJ બંધ / ધીમું કરાવશે',
        location: 'DJ Console',
        actionNotes: 'Turn down loud DJ decibels at 10 PM sharp. Continue with low acoustic music and family garba.',
        urgentRule: 'Surat police regulation: Turn down loud DJ sound promptly at 10:00 PM!'
      },
      {
        id: 's-20-10',
        time: '11:30 PM',
        title: 'Late Night Ice Cream Service',
        gujaratiTitle: 'ગરબા છેલ્લે આઈસક્રીમ',
        location: 'Catering Counter',
        actionNotes: 'Ice cream served to all garba guests (joint counter or separate). Wrap up and home by 01:00 AM.'
      }
    ]
  },
  {
    id: 'feb-21',
    dateString: '2027-02-21',
    dayName: 'Sunday',
    title: 'Day 2: 5 AM Jaan, Lagan Vidhi & Phere',
    location: 'Silver Farm, Surat',
    items: [
      {
        id: 's-21-1',
        time: '04:30 AM',
        title: 'ICER Truck Assembly & Sound Check',
        gujaratiTitle: 'આઈસર ટ્રક તૈયારી (૪ બેઝ ૪ ટોપ)',
        location: 'Groom Residence',
        actionNotes: 'ICER truck arrives with 4 Base 4 Top, C-truss, floral decoration, and sound operator ready.',
        soundRig: 'ICER Truck 4 Base 4 Top + C-truss & flowers (₹15,000)'
      },
      {
        id: 's-21-2',
        time: '05:00 AM',
        title: 'JAAN DEPARTURE',
        gujaratiTitle: '૫ વાગે જાન લઈને નીકળવું',
        location: 'Groom Residence to Silver Farm',
        actionNotes: '5 wage chokra wala jaan leine jay promptly at 5:00 AM on ICER truck!',
        urgentRule: 'Boy side departs strictly at 05:00 AM sharp!',
        outfitGroom: 'Lagan Wedding Suit'
      },
      {
        id: 's-21-3',
        time: '09:30 AM',
        title: 'Varmala & Mandap Sthapana',
        gujaratiTitle: 'વરમાળા અને મંડપ સ્થાપના',
        location: 'Silver Farm Mandap',
        actionNotes: 'Varmala entrance with slow music / lagan geet sound system (2 Base, 2 Top).',
        soundRig: '2 Base, 2 Top (₹4,000, 1 operator for slow music)'
      },
      {
        id: 's-21-4',
        time: '10:30 AM',
        title: 'Hastamelap, Phere & Kanyadaan',
        gujaratiTitle: 'હસ્તમેળાપ, ફેરા અને કન્યાદાન',
        location: 'Silver Farm Mandap',
        actionNotes: 'Sacred wedding rituals with Bhavnagar elders and family Brahman.',
        outfitGroom: 'Lagan Wedding Suit',
        outfitBride: 'Bridal Panetar'
      },
      {
        id: 's-21-5',
        time: '01:00 PM',
        title: 'Wedding Lunch (Jamanvar) & Vidai',
        gujaratiTitle: 'લગ્ન જમણવાર અને વિદાય',
        location: 'Silver Farm Dining Area',
        actionNotes: 'Final celebratory wedding feast with round tables, followed by heartfelt Vidai.'
      }
    ]
  }
];

export const INITIAL_DECISION_POINTS: DecisionPoint[] = [
  {
    id: 'dec-1',
    question: 'Ask elders: Annual function timing in first half or second half?',
    options: ['First Half (Morning)', 'Second Half (Evening)'],
    status: 'Pending',
    decision: ''
  },
  {
    id: 'dec-2',
    question: 'Ask elders: Marriage together at Silver Farm or separate mandvos?',
    options: ['Together at Silver Farm', 'Separate Mandvos'],
    status: 'Pending',
    decision: ''
  },
  {
    id: 'dec-3',
    question: 'Mandvo location: Inside Farm Dome (if available) or construct standalone mandvo?',
    options: ['Inside Farm Dome', 'Construct Standalone Mandap'],
    status: 'Pending',
    decision: ''
  },
  {
    id: 'dec-4',
    question: 'Garba ice cream counter: Joint (bhega) or separate (pot-potani tya)?',
    options: ['Joint Counter (Bhega)', 'Separate Counters (Pot-potani tya)'],
    status: 'Pending',
    decision: ''
  }
];

export const INITIAL_NOTES: PlanningNote[] = [
  {
    id: 'note-1',
    title: 'Gujarati Rituals & Schedule Notes (Mandvo, Chab, Garba, Jaan)',
    category: 'Rituals & Traditions',
    content: `20 Feb:
• Bapore pachi Mandvo: Ganpati & Brahman puja vidhi (approx 2 hours). To be held inside the dome if available, otherwise construct a dedicated mandvo.
• Chab Devani: Immediately after mandvo finishes, both sides exchange chab gift baskets.
• Paat Utraman: Relatives come to hand over shagun covers. Boy sits in boy side mandvo; girl sits in girl side mandvo.
• Parlour & Prep: Bride makeup starts 2:00–3:00 PM and finishes strictly by 5:00–5:30 PM. Followed by couple portraits, sunset photos, and dinner.
• Garba & Couple Entry: Girl performs half-time garba at her peer side first, then makes a grand entry at the main venue. Ras garba until end, wind up by 1:00 AM.
• Ice Cream: Served at the end of garba night (confirm joint or separate counters).

21 Feb:
• 05:00 AM sharp: Jaan departure from Groom side on ICER truck.`,
    pinned: true,
    tags: ['Bhavnagar Traditions', 'Mandvo', 'Chab', 'Jaan'],
    updatedAt: '2026-10-22'
  },
  {
    id: 'note-2',
    title: 'Sound System Rig, DJ & Lighting (Dhaval Jajenwala & Silver Farm)',
    category: 'Sound & Technical',
    content: `• Haldi (Feb 20 Morning): 2 Base, 2 Top. Rate ₹4,000 with 1 sound operator.
• Sangeet / Garba Night (Feb 20 Evening): Rate ₹24,000. 6 Base, 6 Top, 16 LED small round lights, 6 Safi (white floodlights), 4 battle top lights. 1 sound operator + 1 lighting operator.
• Truss & Structure: 40ft length C-truss structure + top square ring. 6 Base 6 Top is plenty of punch for 500–800 guests at Silver Farm.
• Police 10 PM Curfew: Surat police will strictly stop high DJ sound at 10:00 PM. Bride entry and couple dances must happen before 10 PM.
• Jaan (Feb 21 05:00 AM): Need ICER truck with 4 Base, 4 Top, sound operator, C-truss & floral decoration. Total ₹15,000.
• Lagan (Feb 21 Morning): 2 Base, 2 Top. Rate ₹4,000 with 1 operator (slow music / lagan geet).
• Generator: Available on rent. Get vendor contact number directly from Dhaval Jajenwala.`,
    pinned: true,
    tags: ['Dhaval Jajenwala', 'DJ', 'Truss', 'ICER'],
    updatedAt: '2026-10-22'
  },
  {
    id: 'note-3',
    title: 'Silver Farm Ground Operations, Food & Staffing Checklist',
    category: 'Venue & Food',
    content: `• Venue Staff to Assign:
  - Farm saf-safai crew (cleaning before, during, and after functions)
  - 2 Gate watchmen for parking direction and entry security
  - Dedicated 'Pani valo' (water distributor for hot daytime vidhis)
  - Pirsava vala (dedicated servers for round dining tables)
  - Vasan utkva vala (dishwashing / cleaning staff)

• Catering & Food Protocol:
  - Welcome drinks upon guest arrival
  - Nasta / hot snacks counter during Garba night
  - Jamanvar: 2 to 3 seatings with caterer round tables setup (Optional)
  - Late night ice cream counter at Garba wrap-up (joint or separate)`,
    pinned: false,
    tags: ['Silver Farm', 'Catering', 'Manpower'],
    updatedAt: '2026-10-22'
  },
  {
    id: 'note-4',
    title: 'Wardrobe & Function Outfits (Groom & Bride Breakdown)',
    category: 'Outfits & Styling',
    content: `• Feb 19 Morning (Lagan-Lakhan & Vana): Traditional cotton kurta pajama for Groom; traditional saree for Bride.
• Feb 19 Evening (Geet Gunjan / Varghodo): Semi-formal Jodhpuri suit or tailored blazer.
• Feb 20 Morning (Haldi): Kurta pajama with Blue, White, or Lavender theme.
• Feb 20 Noon (Grah Shanti & Mandvo): Traditional coty (bandi) with kurta.
• Feb 20 Evening (Sangeet / Reception): Formal reception suit or Jodhpuri (alternative: crisp shirt & trousers).
• Feb 21 Morning (Lagan Vidhi): Formal wedding suit / traditional wedding attire.`,
    pinned: false,
    tags: ['Groom Outfits', 'Haldi Blue Theme', 'Suits'],
    updatedAt: '2026-10-22'
  },
  {
    id: 'note-5',
    title: 'Fiance Discussions & Key Planning Principles',
    category: 'Family & Fiance',
    content: `• Month-to-Month Planning Strategy:
  - Track tasks systematically month by month (Oct 2026 through Feb 2027) to avoid last-minute stress.
  - Review remaining task numbers weekly.
• Key Inquiries to Re-confirm with Elders:
  1. Ask about annual function scheduling (first half vs second half).
  2. Confirm marriage vidhis format (together at Silver Farm or separate mandvos).
• Pre-Wedding Shoot:
  - Scout and confirm couple photoshoot location before December.`,
    pinned: false,
    tags: ['Fiance', 'Month Tracking', 'Elders'],
    updatedAt: '2026-10-22'
  }
];
