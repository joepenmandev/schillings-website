# People expertise hub membership audit

**Generated:** 2026-05-07 (refresh: `npm run audit:people-expertise-hubs`)

**Scope:** Compare `expertise[]` (hub membership via `peopleForExpertise`) with **effective** directory department (`resolvePersonPracticeGroup`: overrides → import `practiceGroup` → inference).

**Audit map:** §1 legal contamination · §2 DR tag/PG alignment · §3 intel tag outliers · §4 comms PG · §5 legal completeness heuristic · §6 corporate/intl + litigation · §7 per-hub counts · §8 tests · §9 review summary · §10 staged decisions.

**Definitions:**
- **Import `practiceGroup`** — value stored in `people-imported.json` (explicit department when set).
- **Effective practice group** — directory/byline resolution: `people-practice-group-overrides.json` → else `resolvePracticeGroup(role, expertise, import practiceGroup, bio)`.
- **Hub membership** — `expertise[]` contains the `ExpertiseId`; see `peopleForExpertise()` in `service-hubs.ts`.

## Operating notes
- **Byline & directory** — Import `practiceGroup`, overrides, and inference produce the **effective** practice group on people cards; that is **department ownership** in the directory, separate from expertise-hub rosters.
- **Expertise hubs** — Only `expertise[]` determines who appears on `/expertise/{slug}/` pages (`peopleForExpertise`).
- **Allowlists** — Use `src/data/people-expertise-hub-allowlists.ts` **only** for **documented** exceptions; default is to correct `people-imported.json` (or overrides).
- **Ambiguous cases** — If tags conflict with role or public bio intent, **human review** before editing data.

## 1. Legal hub (`litigation_disputes`) vs effective practice group
- _No profiles: everyone with `litigation_disputes` has effective practice group `legal`._

## 2. Digital Resilience (`digital_resilience`)
### 2a. Has `digital_resilience` but effective PG is not `dr`
- _None._

### 2b. Import `practiceGroup` is `dr` but missing `digital_resilience`
- _None._

### 2c. Effective PG is `dr` but missing `digital_resilience` (includes override-only `dr`)
- _None._

## 3. `intelligence_security` vs effective practice group (flag only)
- Total with `intelligence_security`: **83**
- Effective PG is neither `isd` nor `dr`: **53** (legal / scom lawyers or comms with intel tags — often intentional).

### Profiles (effective legal or scom with `intelligence_security`)
- **Alasdair Drennan** (`alasdair-drennan`) — **scom**, import scom, expertise: `reputation_privacy, intelligence_security, communications`
- **Aleksandra Trajkovic** (`aleksandra-trajkovic`) — **scom**, import scom, expertise: `reputation_privacy, intelligence_security, communications`
- **Alexander Shaw** (`alexander-shaw`) — **scom**, import scom, expertise: `reputation_privacy, intelligence_security, international, regulatory`
- **Allan Dunlavy** (`allan-dunlavy`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, international`
- **Anna Bloch** (`anna-bloch`) — **scom**, import scom, expertise: `reputation_privacy, intelligence_security, communications`
- **Aoife Butler-Nolan** (`aoife-butler-nolan`) — **scom**, import scom, expertise: `reputation_privacy, intelligence_security, communications`
- **Ben Hobbs** (`ben-hobbs`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, international`
- **Charlotte Watson** (`charlotte-watson`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, communications`
- **Claire Greaney** (`claire-greaney`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, communications`
- **Claudine Murphy** (`claudine-murphy`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, communications`
- **David Imison** (`david-imison`) — **legal**, import isd, expertise: `reputation_privacy, intelligence_security, international`
- **Emily Maister** (`emily-maister`) — **scom**, import scom, expertise: `reputation_privacy, intelligence_security, communications`
- **Emily Mitcheson** (`emily-mitcheson`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, communications`
- **Filip Sys** (`filip-sys`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, communications`
- **George Pascoe-Watson** (`george-pascoe-watson`) — **scom**, import scom, expertise: `reputation_privacy, intelligence_security, communications, international`
- **Gillian Duffy** (`gillian-duffy`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, international`
- **Harriet Black** (`harriet-black`) — **scom**, import scom, expertise: `reputation_privacy, intelligence_security, communications`
- **Hind Habib** (`hind-habib`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, communications`
- **Hope Watson** (`hope-watson`) — **scom**, import scom, expertise: `reputation_privacy, intelligence_security, communications`
- **Jamie Fenton** (`jamie-fenton`) — **scom**, import scom, expertise: `reputation_privacy, intelligence_security, communications`
- **Jason Frydman** (`jason-frydman`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, communications`
- **Jenna Goldberg** (`jenna-goldberg`) — **scom**, import scom, expertise: `reputation_privacy, intelligence_security, communications`
- **Jenny Afia** (`jenny-afia`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, international`
- **Jessica Wotton** (`jessica-wotton`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, communications`
- **Joelle Rich** (`joelle-rich`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, international`
- **John Curtin** (`john-curtin`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, communications`
- **Juliet Young** (`juliet-young`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, international`
- **Keith Schilling** (`keith-schilling`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, international`
- **Lauren Arthur-Davies** (`lauren-arthur-davies`) — **scom**, import scom, expertise: `reputation_privacy, intelligence_security, communications`
- **Leila Khaze** (`leila-khaze`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, communications`
- **Lily Wowk** (`lily-wowk`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, communications`
- **Linda Gu** (`linda-gu`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, communications`
- **Mark Phillips** (`mark-phillips`) — **scom**, import scom, expertise: `reputation_privacy, intelligence_security, communications`
- **Mark Tibbs** (`mark-tibbs`) — **legal**, import legal, expertise: `litigation_disputes, intelligence_security, corporate_transactions, regulatory`
- **Matthew Denton** (`matthew-denton`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, communications`
- **Michael Mpofu** (`michael-mpofu`) — **scom**, import scom, expertise: `reputation_privacy, intelligence_security, communications`
- **Michaela Janu** (`michaela-janu`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, communications`
- **Mili Shah** (`mili-shah`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, communications`
- **Natasha Hibbert** (`natasha-hibbert`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, communications`
- **Nick Brough** (`nick-brough`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, communications`
- **Peter Wilson** (`peter-wilson`) — **scom**, import scom, expertise: `reputation_privacy, intelligence_security, communications`
- **Phil Hartley** (`phil-hartley`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, international`
- **Rachel Atkins** (`rachel-atkins`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, international`
- **Rod Christie-Miller** (`rod-christie-miller`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, international`
- **Sam Ahuja** (`sam-ahuja`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, international`
- **Sarah Alawi** (`sarah-alawi`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, communications`
- **Sarah Reynolds** (`sarah-reynolds`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, communications`
- **Sian Akerman** (`sian-akerman`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, communications`
- **Simon Brown** (`simon-brown`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, communications`
- **Simon Harris** (`simon-harris`) — **scom**, import scom, expertise: `reputation_privacy, intelligence_security, communications`
- **Steven Hudson** (`steven-hudson`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, communications`
- **Victoria Anderson** (`victoria-anderson`) — **legal**, import legal, expertise: `reputation_privacy, litigation_disputes, intelligence_security, communications`
- **Victoria O’Byrne** (`victoria-obyrne`) — **scom**, import scom, expertise: `reputation_privacy, intelligence_security, communications, international`

## 4. `communications` vs effective practice group (flag only)
- Total with `communications`: **48**
- Effective PG not in {scom, dr, isd, legal}: **0**

## 5. Legal completeness (heuristic — needs human review)
- Effective **legal** with `reputation_privacy` but **no** `litigation_disputes`: **1** — consider adding the tag if they should appear on the Legal Protection & Disputes hub.
- **David Imison** (`david-imison`) — expertise: `reputation_privacy, intelligence_security, international`, role: _Chief Executive Officer_

## 6. Corporate / international emphasis + `litigation_disputes` (review)
- **Mark Tibbs** (`mark-tibbs`) — effective **legal**, expertise: `litigation_disputes, intelligence_security, corporate_transactions, regulatory`

## 7. Hub membership by `ExpertiseId`
### `reputation_privacy` — **83** people
- Effective PG distribution: dr: 7; isd: 16; legal: 43; scom: 17
- Slugs: abby-stanglin, alasdair-drennan, aleksandra-trajkovic, alexander-shaw, allan-dunlavy, anna-bloch, aoife-butler-nolan, ben-hobbs, brett-reynolds, charlie-lait, charlotte-finney, charlotte-watson, chris-bell-watson, claire-greaney, claudine-murphy, david-imison, elaine-gilchrist, emily-maister, emily-mitcheson, evgenia-ashworth, filip-sys, filipa-macedo, george-pascoe-watson, gillian-duffy, giulia-valeri, harriet-black, hind-habib, hope-watson, jack-ryan, jamie-fenton, jason-frydman, jenna-goldberg, jenny-afia, jessica-boyce, jessica-wotton, joe-mooney, joelle-rich, john-curtin, josh-leigh, juliet-young, karl-van-der-plas, keith-schilling, lauren-arthur-davies, lauren-dye, lauren-ekblom, leila-khaze, leyla-najafli, lily-kennett, lily-wowk, linda-gu, louise-prince, luke-kibblewhite, madeleine-moore, mark-phillips, matthew-denton, matthew-powell, michael-mpofu, michaela-janu, mili-shah, natasha-hibbert, nick-brough, pavel-trosin, peter-wilson, phil-hartley, rachel-atkins, rod-christie-miller, sacha-levine, sam-ahuja, sarah-alawi, sarah-reynolds, sian-akerman, simon-brown, simon-curran, simon-harris, steven-hudson, tim-robinson, victoria-anderson, victoria-obyrne, victoria-vasileva, viv-oconnor-jemmett, will-lowe, zahra-gray, zoe-cousins

### `litigation_disputes` — **43** people
- Effective PG distribution: legal: 43
- Slugs: allan-dunlavy, ben-hobbs, charlotte-watson, claire-greaney, claudine-murphy, elaine-gilchrist, emily-mitcheson, evgenia-ashworth, filip-sys, gillian-duffy, hind-habib, jason-frydman, jenny-afia, jessica-boyce, jessica-wotton, joelle-rich, john-curtin, juliet-young, karl-van-der-plas, keith-schilling, leila-khaze, lily-wowk, linda-gu, louise-prince, luke-kibblewhite, mark-tibbs, matthew-denton, michaela-janu, mili-shah, natasha-hibbert, nick-brough, phil-hartley, rachel-atkins, rod-christie-miller, sacha-levine, sam-ahuja, sarah-alawi, sarah-reynolds, sian-akerman, simon-brown, simon-curran, steven-hudson, victoria-anderson

### `intelligence_security` — **83** people
- Effective PG distribution: dr: 5; isd: 25; legal: 36; scom: 17
- Slugs: abby-stanglin, adam-wilkinson, alasdair-drennan, aleksandra-trajkovic, alexander-shaw, allan-dunlavy, anna-bloch, aoife-butler-nolan, ben-hobbs, bota-iliyas, brett-reynolds, brittany-damora, caterina-arcuri, charlie-lait, charlotte-finney, charlotte-watson, chris-bell-watson, claire-greaney, claudine-murphy, craig-edwards, david-imison, ella-handy, emily-maister, emily-mitcheson, emily-white, filip-sys, filipa-macedo, george-pascoe-watson, gillian-duffy, giulia-valeri, harriet-black, hind-habib, hope-watson, jack-ryan, jamie-fenton, jason-frydman, jenna-goldberg, jenny-afia, jessica-wotton, joe-mooney, joelle-rich, john-curtin, josh-leigh, juliet-young, keith-schilling, lauren-arthur-davies, lauren-dye, lauren-ekblom, leila-khaze, lily-kennett, lily-wowk, linda-gu, madeleine-moore, mark-phillips, mark-tibbs, matthew-denton, matthew-powell, michael-mpofu, michaela-janu, mili-shah, natasha-hibbert, nick-brough, pavel-trosin, peter-wilson, phil-hartley, rachel-atkins, rachel-ibbetson, rod-christie-miller, sam-ahuja, sarah-alawi, sarah-reynolds, sian-akerman, simon-brown, simon-harris, sir-mark-lyall-grant, steven-hudson, tim-robinson, victoria-anderson, victoria-obyrne, victoria-vasileva, will-lowe, zahra-gray, zoe-cousins

### `digital_resilience` — **8** people
- Effective PG distribution: dr: 8
- Slugs: charlie-lait, chris-bell-watson, josh-leigh, lauren-dye, leyla-najafli, meg-lawrence, pavel-trosin, viv-oconnor-jemmett

### `communications` — **48** people
- Effective PG distribution: dr: 8; legal: 24; scom: 16
- Slugs: alasdair-drennan, aleksandra-trajkovic, anna-bloch, aoife-butler-nolan, charlie-lait, charlotte-watson, chris-bell-watson, claire-greaney, claudine-murphy, emily-maister, emily-mitcheson, filip-sys, george-pascoe-watson, harriet-black, hind-habib, hope-watson, jamie-fenton, jason-frydman, jenna-goldberg, jessica-wotton, john-curtin, josh-leigh, lauren-arthur-davies, lauren-dye, leila-khaze, leyla-najafli, lily-wowk, linda-gu, mark-phillips, matthew-denton, meg-lawrence, michael-mpofu, michaela-janu, mili-shah, natasha-hibbert, nick-brough, pavel-trosin, peter-wilson, sacha-levine, sarah-alawi, sarah-reynolds, sian-akerman, simon-brown, simon-harris, steven-hudson, victoria-anderson, victoria-obyrne, viv-oconnor-jemmett

### `corporate_transactions` — **5** people
- Effective PG distribution: isd: 2; legal: 3
- Slugs: charlotte-finney, lord-browne-of-madingley, mark-tibbs, sir-george-buckley, zahra-gray

### `international` — **40** people
- Effective PG distribution: isd: 23; legal: 14; scom: 3
- Slugs: abby-stanglin, adam-wilkinson, alexander-shaw, allan-dunlavy, ben-hobbs, bota-iliyas, brett-reynolds, brittany-damora, caterina-arcuri, david-imison, ella-handy, emily-white, filipa-macedo, george-pascoe-watson, gillian-duffy, giulia-valeri, jack-ryan, jenny-afia, joe-mooney, joelle-rich, juliet-young, keith-schilling, lauren-ekblom, lily-kennett, lord-browne-of-madingley, madeleine-moore, matthew-powell, phil-hartley, rachel-atkins, rachel-ibbetson, rod-christie-miller, sam-ahuja, sir-george-buckley, sir-mark-lyall-grant, tim-robinson, victoria-obyrne, victoria-vasileva, will-lowe, zahra-gray, zoe-cousins

### `regulatory` — **20** people
- Effective PG distribution: isd: 17; legal: 2; scom: 1
- Slugs: abby-stanglin, adam-wilkinson, alexander-shaw, bota-iliyas, brittany-damora, caterina-arcuri, charlotte-finney, ella-handy, emily-white, giulia-valeri, jack-ryan, joe-mooney, karl-van-der-plas, lauren-ekblom, madeleine-moore, mark-tibbs, victoria-vasileva, will-lowe, zahra-gray, zoe-cousins

## 8. Regression tests
- See `src/data/people-expertise-hub-membership.test.ts` — allowlists in `src/data/people-expertise-hub-allowlists.ts`.

## 9. Needs human review (summary)
- Any row in §2a / §6 / unusual §7 outliers.
- §5 list: reputation-facing profiles **without** `litigation_disputes` — consider hub intent case-by-case (see §10 for resolved examples).

## 10. Staged review decisions
- **David Imison** (`david-imison`) — **No data change.** Public bio emphasises CEO leadership, strategic growth, and reputation / high-stakes client work (e.g. Spear’s reputation index); it does **not** position front-line **Legal Protection & Disputes** delivery. Keeping **`litigation_disputes` absent** is appropriate.
- **Mark Tibbs** (`mark-tibbs`) — **No data change.** Bio describes multi-jurisdictional **disputes**, supporting matters through **legal proceedings**, and Partner-level investigations leadership at a city law firm; **`litigation_disputes` retained** as intentional.
