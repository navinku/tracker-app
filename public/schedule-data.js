/* Shared schedule data used by schedule.html and dashboard.html */
const SCHEDULE_ROWS = [
  { time:'05:30–06:30', s:[5,30],  e:[6,30],  cells:[['Yoga + Meditation','yoga'],['Yoga + Meditation','yoga'],['Yoga + Meditation','yoga'],['Yoga + Meditation','yoga'],['Yoga + Meditation','yoga'],['Yoga + Meditation (slow)','yoga'],['Sleep in / Rest','sleep']] },
  { time:'06:30–07:00', s:[6,30],  e:[7,0],   cells:[['Personal Learning','personal'],['Personal Learning','personal'],['Personal Learning','personal'],['Personal Learning','personal'],['Personal Learning','personal'],['Personal Learning','personal'],['Rest / No alarm','sleep']] },
  { time:'07:00–07:30', s:[7,0],   e:[7,30],  cells:[['Work Learning','worklearn'],['Work Learning','worklearn'],['Work Learning','worklearn'],['Work Learning','worklearn'],['Work Learning','worklearn'],['Off / Family','family'],['Family Morning','family']] },
  { time:'07:30–08:00', s:[7,30],  e:[8,0],   cells:[['Kid School Bus Drop','family'],['Kid School Bus Drop','family'],['Kid School Bus Drop','family'],['Kid School Bus Drop','family'],['Kid School Bus Drop','family'],['Kid School Bus Drop','family'],['Family Morning','family']] },
  { time:'08:00–08:30', s:[8,0],   e:[8,30],  cells:[['Breakfast + Inhouse','family'],['Breakfast + Inhouse','family'],['Breakfast + Inhouse','family'],['Breakfast + Inhouse','family'],['Breakfast + Inhouse','family'],['Breakfast + Family','family'],['Breakfast + Family','family']] },
  { time:'08:30–09:00', s:[8,30],  e:[9,0],   cells:[['APAC Standup 30min','apac'],['APAC Standup 30min','apac'],['APAC Standup 30min','apac'],['APAC Standup 30min','apac'],['APAC Standup 30min','apac'],['No Standup','off'],['Rest','sleep']] },
  { time:'09:00–10:00', s:[9,0],   e:[10,0],  cells:[['Work Learning + APAC Async','worklearn'],['Work Learning + APAC Async','worklearn'],['Work Learning + APAC Async','worklearn'],['Work Learning + APAC Async','worklearn'],['Work Learning + APAC Async','worklearn'],['Family / Errands','family'],['Family Time','family']] },
  { time:'10:00–13:00', s:[10,0],  e:[13,0],  cells:[['DEEP WORK: POC / Automation','deep'],['DEEP WORK: Migration Chunk','deep'],['DEEP WORK: DB / Access / Security','deep'],['DEEP WORK: Upgrades / IaC','deep'],['DEEP WORK: Docs + Retro','deep'],['Family Outing / Errands','family'],['Family Time','family']] },
  { time:'13:00–14:00', s:[13,0],  e:[14,0],  cells:[['Lunch + Full Rest (screen off)','family'],['Lunch + Full Rest','family'],['Lunch + Full Rest','family'],['Lunch + Full Rest','family'],['Lunch + Full Rest','family'],['Family Lunch','family'],['Family Lunch','family']] },
  { time:'14:00–15:30', s:[14,0],  e:[15,30], cells:[['Prod Tickets + P1 Buffer','tickets'],['Bug Fixes + P1','tickets'],['Prod Tickets + P1 Buffer','tickets'],['Bug Fixes + P1','tickets'],['Ticket Cleanup','tickets'],['Rest / Nap','sleep'],['Rest / Nap','sleep']] },
  { time:'15:30–16:00', s:[15,30], e:[16,0],  cells:[['Enhancement Tickets','enhance'],['Enhancement Tickets','enhance'],['Enhancement Tickets','enhance'],['Enhancement Tickets','enhance'],['Enhancement Review','enhance'],['Off','off'],['Off','off']] },
  { time:'16:00–17:00', s:[16,0],  e:[17,0],  cells:[['EMEA Sync 60min','emea'],['EMEA Sync 60min','emea'],['EMEA Sync 60min','emea'],['EMEA Sync 60min','emea'],['EMEA Week-close','emea'],['No EMEA','off'],['Off','off']] },
  { time:'17:00–18:30', s:[17,0],  e:[18,30], cells:[['Runbook + Ticket Close','docs'],['Docs + Async EMEA','docs'],['Post-mortem Write-up','docs'],['Architecture Notes','docs'],['Week Summary to Manager','docs'],['Family Afternoon','family'],['Family / Personal','family']] },
  { time:'18:30–19:30', s:[18,30], e:[19,30], cells:[['Dinner + Family (no screens)','dinner'],['Dinner + Family (no screens)','dinner'],['Dinner + Family (no screens)','dinner'],['Dinner + Family (no screens)','dinner'],['Dinner + Family (Early close)','dinner'],['Dinner + Family','dinner'],['Dinner + Family','dinner']] },
  { time:'19:30–20:00', s:[19,30], e:[20,0],  cells:[['US Standup 30min','us'],['Evening Walk/Gym','workout'],['US Standup 30min','us'],['Evening Walk/Gym','workout'],['US Standup 30min','us'],['Walk / Personal Time','workout'],['Week Planning 30min','worklearn']] },
  { time:'20:00–21:00', s:[20,0],  e:[21,0],  cells:[['Evening Walk / Gym','workout'],['Evening Walk / Gym','workout'],['Evening Walk / Gym','workout'],['Evening Walk / Gym','workout'],['Evening Walk / Gym','workout'],['Walk / Gym','workout'],['Family / Relax','family']] },
  { time:'21:00–21:30', s:[21,0],  e:[21,30], cells:[['Community blog/OSS/forum','community'],['Community blog/OSS/forum','community'],['Community blog/OSS/forum','community'],['Community blog/OSS/forum','community'],['Early Wind Down','sleep'],['Wind Down','sleep'],['Wind Down','sleep']] },
  { time:'21:30–22:00', s:[21,30], e:[22,0],  cells:[['Wind Down · No Screens','sleep'],['Wind Down · No Screens','sleep'],['Wind Down · No Screens','sleep'],['Wind Down · No Screens','sleep'],['Wind Down · No Screens','sleep'],['Wind Down · No Screens','sleep'],['Wind Down · Prep Mon','sleep']] },
  { time:'22:00–05:30', s:[22,0],  e:[5,30],  overnight:true, cells:[['Sleep 7.5 hrs','sleep'],['Sleep 7.5 hrs','sleep'],['Sleep 7.5 hrs','sleep'],['Sleep 7.5 hrs','sleep'],['Sleep 7.5 hrs','sleep'],['Sleep 9 hrs (→07:00)','sleep'],['Sleep 7.5 hrs (→05:30)','sleep']] },
];

const CATEGORIES = [
  ['yoga','Yoga'],['personal','Personal Learning'],['worklearn','Work Learning'],
  ['family','Family'],['apac','APAC Meeting'],['emea','EMEA Meeting'],['us','US Meeting'],
  ['deep','Deep Work'],['tickets','Prod Tickets'],['enhance','Enhancement'],
  ['docs','Docs / Runbooks'],['dinner','Dinner / Family'],['workout','Workout'],
  ['community','Community'],['sleep','Sleep'],['off','Off'],
];

function applyOverrides(rows, overrides) {
  /* returns a deep-cloned rows array with overrides applied */
  const cloned = rows.map(r => ({ ...r, cells: r.cells.map(c => [...c]) }));
  overrides.forEach(o => {
    if (cloned[o.row_idx]) {
      cloned[o.row_idx].cells[o.day_idx] = [o.label, o.category];
    }
  });
  return cloned;
}
