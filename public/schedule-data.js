/* Shared schedule data used by schedule.html and dashboard.html */
const SCHEDULE_ROWS = [
  { time:'05:30–06:30', s:[5,30],  e:[6,30],  cells:[['Yoga + Meditation','yoga'],['Yoga + Meditation','yoga'],['Yoga + Meditation','yoga'],['Yoga + Meditation','yoga'],['Yoga + Meditation','yoga'],['Yoga + Meditation (slow)','yoga'],['Sleep in / Rest','sleep']] },
  { time:'06:30–07:00', s:[6,30],  e:[7,0],   cells:[['Personal Learning','personal'],['Personal Learning','personal'],['Personal Learning','personal'],['Personal Learning','personal'],['Personal Learning','personal'],['Personal Learning','personal'],['Rest / No alarm','sleep']] },
  { time:'07:00–07:30', s:[7,0],   e:[7,30],  cells:[['Personal / Family','family'],['Personal / Family','family'],['Personal / Family','family'],['Personal / Family','family'],['Personal / Family','family'],['Off / Family','family'],['Family Morning','family']] },
  { time:'07:30–08:00', s:[7,30],  e:[8,0],   cells:[['Kid School Bus Drop','family'],['Kid School Bus Drop','family'],['Kid School Bus Drop','family'],['Kid School Bus Drop','family'],['Kid School Bus Drop','family'],['Kid School Bus Drop','family'],['Family Morning','family']] },
  { time:'08:00–08:30', s:[8,0],   e:[8,30],  cells:[['Breakfast + Inhouse','family'],['Breakfast + Inhouse','family'],['Breakfast + Inhouse','family'],['Breakfast + Inhouse','family'],['Breakfast + Inhouse','family'],['Breakfast + Family','family'],['Breakfast + Family','family']] },
  { time:'08:30–12:00', s:[8,30],  e:[12,0],  cells:[['DEEP WORK: POC / Automation','deep'],['DEEP WORK: Migration Chunk','deep'],['DEEP WORK: DB / Access / Security','deep'],['DEEP WORK: Upgrades / IaC','deep'],['DEEP WORK: Docs + Retro','deep'],['Family Outing / Errands','family'],['Family Time','family']] },
  { time:'12:00–12:30', s:[12,0],  e:[12,30], cells:[['Personal / Family Support','family'],['Personal / Family Support','family'],['Personal / Family Support','family'],['Personal / Family Support','family'],['Personal / Family Support','family'],['Family / Errands','family'],['Family Time','family']] },
  { time:'12:30–13:00', s:[12,30], e:[13,0],  cells:[['Short Meeting / Random Tickets','tickets'],['Short Meeting / Random Tickets','tickets'],['Short Meeting / Random Tickets','tickets'],['Short Meeting / Random Tickets','tickets'],['Short Meeting / Random Tickets','tickets'],['Family Lunch','family'],['Family Lunch','family']] },
  { time:'13:00–13:30', s:[13,0],  e:[13,30], cells:[['Lunch','family'],['Lunch','family'],['Lunch','family'],['Lunch','family'],['Lunch','family'],['Rest / Nap','sleep'],['Rest / Nap','sleep']] },
  { time:'13:30–14:30', s:[13,30], e:[14,30], cells:[['Kid School Pickup','family'],['Kid School Pickup','family'],['Kid School Pickup','family'],['Kid School Pickup','family'],['Kid School Pickup','family'],['Rest / Nap','sleep'],['Rest / Nap','sleep']] },
  { time:'14:30–16:00', s:[14,30], e:[16,0],  cells:[['Prod Tickets + P1 Buffer','tickets'],['Bug Fixes + P1','tickets'],['Prod Tickets + P1 Buffer','tickets'],['Bug Fixes + P1','tickets'],['Ticket Cleanup + Enhancement','enhance'],['Off','off'],['Off','off']] },
  { time:'16:00–17:30', s:[16,0],  e:[17,30], cells:[['Personal Workout','workout'],['Personal Workout','workout'],['Personal Workout','workout'],['Personal Workout','workout'],['Personal Workout','workout'],['Walk / Gym','workout'],['Off','off']] },
  { time:'17:30–19:00', s:[17,30], e:[19,0],  cells:[['EMEA Sync / Docs / Ticket Close','emea'],['EMEA Sync / Docs / Async','emea'],['EMEA Sync / Post-mortem','emea'],['EMEA Sync / Architecture Notes','emea'],['EMEA Week-close / Week Summary','emea'],['Family Afternoon','family'],['Family / Personal','family']] },
  { time:'19:00–20:00', s:[19,0],  e:[20,0],  cells:[['Dinner + Family','dinner'],['Dinner + Family','dinner'],['Dinner + Family','dinner'],['Dinner + Family','dinner'],['Dinner + Family','dinner'],['Dinner + Family','dinner'],['Dinner + Family','dinner']] },
  { time:'20:00–20:30', s:[20,0],  e:[20,30], cells:[['US Standup','us'],['Evening Walk / Personal','workout'],['US Standup','us'],['Evening Walk / Personal','workout'],['US Standup','us'],['Walk / Personal Time','workout'],['Week Planning','worklearn']] },
  { time:'20:30–21:30', s:[20,30], e:[21,30], cells:[['US Team Sync / Support','us'],['US Team Sync / Support','us'],['US Team Sync / Support','us'],['US Team Sync / Support','us'],['US Team Sync / Support','us'],['Walk / Gym','workout'],['Family / Relax','family']] },
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
