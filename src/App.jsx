import React, {
  useMemo, useState, useCallback, useRef, useEffect, useReducer, memo
} from "react";

// ================================================================
// § SEED DATA
// ================================================================
const SEED_PHRASES = [
  "abundant mindset","accurate assessment","active learning","adaptive strategy","adaptive synchronization","aligned intention","aligned output stream","aligned priorities",
  "analytical coherence","anticipatory thinking","authentic presence","balanced perspective","calculated risk taking","calm confidence","clear communication","clear direction",
  "cognitive precision","coherent planning","collaborative effort","consistent output","constructive feedback","creative flow","decisive action","decisive structuring",
  "deep focus","deliberate practice","disciplined effort","dynamic coordination","effective coordination","efficient alignment","elevated awareness","empowered choice",
  "evidence based decision","expanding vision","focused ambition","focused iteration","forward momentum","goal aligned behavior","growth mindset","high accuracy reasoning",
  "high signal thinking","high standards","informed judgment","inner stability","intent driven action","intent synchronization","intentional living","leveraged resources",
  "logical structuring","long term thinking","measured advancement","measured risk","mental clarity","open minded","operational precision","optimized workflow",
  "patient progress","pattern stability","personal evolution","positive outlook","practical wisdom","precision structuring","precision thinking","prioritized action",
  "proactive adjustment","productive routine","purpose aligned output","quality output","rapid learning","rational coordination","refined action flow","resilient mindset",
  "resource calibration","resourceful approach","results oriented","scalable coordination","scalable system","self mastery","self regulation","sharp thinking",
  "signal integrity","situational mastery","solution oriented","steady progress","strategic thinking","strong boundaries","supportive network","sustainable growth",
  "system alignment","systematic improvement","tactical precision","targeted effort","temporal coordination","time efficient process","timely action","unshakeable focus",
  "value coherence","value creation","value driven decisions","winning habits","workflow precision","accurate pattern detection","advanced situational awareness","aligned decision flow",
  "applied intelligence","balanced judgment","capacity expansion","clear operational logic","coordinated problem solving","credible judgment","disciplined consistency","effective prioritization",
  "energetic discipline","evaluative precision","functional clarity","high trust behavior","informed adaptation","intentional discipline","methodical progress","optimized coordination",
  "organized momentum","practical foresight","predictive awareness","precision driven output","reliable follow through","resolved direction","selective focus","self corrected action",
  "stable momentum","structural coherence","successful adaptation","system aware action","target clarity","trustworthy conduct","unified direction","action instability",
  "aimless progression","analysis paralysis","assumption error","attention seeking","avoidant behavior","bad decisions","blind risk taking","broken coordination",
  "broken focus","careless actions","chasing validation","chronic distraction","clouded judgment","cognitive fragmentation","conflicting priorities","constant doubt",
  "coordination instability","decision distortion","decision fatigue","delayed action","destructive habits","directional confusion","disorganized thinking","emotional instability",
  "empty promises","erratic behavior","excessive caution","false confidence","faulty assumptions","faulty structure","fear driven behavior","forced outcomes",
  "goal distortion","goal drift","inaccurate assessment","impulsive reactions","inconsistent effort","information overload","input inconsistency","intent confusion",
  "lack of discipline","logic inconsistency","low awareness","misaligned goals","miscommunication","misdirected output","mismanaged resources","misplaced priorities",
  "negative self talk","no accountability","noise disruption","operational breakdown","output distortion","overcommitment","overextension","overthinking loops",
  "poor coordination","poor judgment","premature action","priority confusion","process instability","reactive decisions","reactive mindset","reasoning distortion",
  "reckless behavior","resource depletion","resource inefficiency","risk blindness","scope creep","self sabotage","shallow focus","short sighted decisions",
  "short term thinking","signal interference","signal noise confusion","stagnant growth","structural instability","system breakdown","task avoidance","task disruption",
  "time mismanagement","timing inconsistency","toxic patterns","unforced errors","unfocused energy","unreliable behavior","unstructured approach","value leakage",
  "value misalignment","wasted effort","wasted potential","weak boundaries","workflow instability","zero direction","zero signal clarity","accuracy loss",
  "agitated behavior","aimless motion","avoidance pattern","blunted awareness","collapsed structure","confused priorities","coordination failure","corrupted judgment",
  "counterproductive action","decision slippage","degraded output","disconnected effort","disrupted planning","drifting intent","error prone process","failure cascade",
  "faulty prioritization","fragmented workflow","hesitant action","imbalanced effort","incomplete follow through","miscalculated risk","misread context","operational drag",
  "panic driven action","pattern blindness","process erosion","routine neglect","self defeating behavior","sequential breakdown","short range fixation","skill erosion",
  "slow adaptation","state confusion","strategic drift","system friction","unstable process","adaptive process","average baseline","average output",
  "baseline behavior","basic routine","common pattern","current model","current situation","daily schedule","default behavior","default setting",
  "default state","dynamic state","existing baseline","existing framework","existing pattern","expected variation","functional baseline","general outcome",
  "gradual change","habit formation","incremental progress","incremental shift","initial phase","input output cycle","intermediate phase","intermediate state",
  "internal process","measured output","moderate change","moderate pace","nominal baseline","normal variation","objective view","ongoing process",
  "operating state","operational state","present moment","primary focus","process flow","reference baseline","reference point","regular activity",
  "relative position","repeating pattern","routine action","standard approach","standard baseline","steady baseline","steady state","system state",
  "system update","typical baseline","typical pattern","typical range","variable outcome","working model","working state","active framework",
  "baseline sequence","common workflow","current phase","default process","dynamic baseline","existing sequence","functional process","general sequence",
  "incremental adaptation","input sequence","measured process","moderate variation","normal process","ongoing cycle","operating framework","ordinary baseline",
  "pattern recurrence","process sequence","regular sequence","repeated cycle","routine process","steady process","system sequence","transitional process",
  "variable sequence","adaptive mindset","alert awareness","aligned mindset","attentive cognition","attentive state","calculated thinking","calibrated thinking",
  "calm focus","centered mind","clear mind","clear perception","coherent thoughts","composed cognition","composed thinking","controlled attention",
  "controlled emotion","deep awareness","deep concentration","deliberate focus","direct awareness","direct perception","disciplined focus","efficient cognition",
  "emotional balance","enhanced clarity","expanded awareness","focused cognition","focused intent","grounded thinking","high clarity state","inner clarity",
  "integrated cognition","integrated thinking","intentional focus","lucid awareness","mental precision","meta awareness","objective awareness","open awareness",
  "organized thinking","perceptual clarity","precise cognition","present awareness","quiet confidence","rational awareness","rational control","rational mindset",
  "refined awareness","relaxed control","resilient thinking","sharp attention","sharp cognition","stable awareness","stable thoughts","steady awareness",
  "structured thinking","sustained attention","sustained cognition","thought precision","unified cognition","unified focus","well structured thinking","zero distortion awareness",
  "active clarity","attuned awareness","calm discernment","centered awareness","cognitive steadiness","composed attention","cool headed thinking","deep stillness",
  "directed cognition","discerning mind","emotionally centered","even minded focus","grounded awareness","inner steadiness","lucid thinking","measured cognition",
  "mental composure","mindful precision","ordered perception","peaceful focus","perceptual steadiness","quiet alertness","reflective clarity","settled awareness",
  "stable discernment","steady perception","thoughtful awareness","unified attention","well ordered mind","whole mind state","anxious mind","attention fragmentation",
  "awareness instability","awareness interference","chaotic thinking","cognitive confusion","cognitive distortion","cognitive overload","cognitive saturation","conflicted perception",
  "confused thinking","decision confusion","defensive mindset","distorted cognition","distorted perception","distracted mind","emotional overload","emotional reactivity",
  "emotional volatility","fearful mindset","focus collapse","focus disruption","fragmented attention","impulsive thinking","indecisive thinking","information distortion",
  "irrational thinking","mental fatigue","mental fog","mental fragmentation","mental rigidity","misaligned thinking","negative spiral","obsessive thinking",
  "overthinking loop","panic state","paranoid thoughts","perceptual bias","perceptual noise","processing instability","racing thoughts","reactive cognition",
  "reasoning instability","rumination cycle","scattered thoughts","self doubt","sensory overload","signal confusion","thought instability","thought interference",
  "tunnel vision","unfocused state","unstable cognition","unstable focus","unstable thoughts","agitated thoughts","attention collapse","cognitive scatter",
  "compulsive rumination","conflicted thinking","defensive thinking","disturbed focus","emotionally flooded","fear saturated thinking","fixated thoughts","fogged perception",
  "fractured cognition","inner turbulence","mental agitation","mental clutter","perceptual drift","reactive attention","restless mind","self defeating thoughts",
  "spiraling attention","state fragmentation","stressed cognition","tense awareness","thought clutter","uncentered thinking","unsettled awareness","volatile attention",
  "worn down thinking","zeroed out focus","adaptive attention","ambient awareness","background thinking","baseline awareness","baseline cognition","contextual thinking",
  "default awareness","default mindset","fluctuating attention","general awareness","general cognition","idle mind","low engagement awareness","low engagement state",
  "low intensity focus","mental drift","mild distraction","moderate awareness","momentary focus","neutral awareness","neutral cognition","observing thoughts",
  "open processing","ordinary thinking","passive awareness","passive thinking","processing cognition","processing input","processing state","resting mind",
  "routine mindset","shifting awareness","situational awareness","standard cognition","standard perception","steady cognition","temporary confusion","transient awareness",
  "transitional state","uncommitted focus","undirected focus","unstimulated mind","variable attention","ambient cognition","baseline attention","casual awareness",
  "default cognition","drifting attention","even awareness","general processing","light focus","low demand cognition","moderate focus","open attention",
  "ordinary awareness","passing thought state","plain awareness","reflective state","routine attention","soft focus","standard awareness","surface thinking",
  "temporary focus","thought observation","variable cognition","accountable leadership layer","aligned authority system","aligned command structure","balanced authority structure","capable management layer",
  "clear accountability structure","clear chain of command","clear command structure","coherent leadership system","competent leadership","coordinated command system","coordinated leadership network","defined leadership structure",
  "disciplined chain of command","distributed authority model","distributed authority system","earned authority level","effective command structure","effective leadership tier","efficient command chain","efficient reporting structure",
  "empowered leadership tier","experienced leadership tier","functional authority flow","functional authority system","functional hierarchy","high level oversight","integrated leadership model","integrated leadership system",
  "layered decision structure","legitimate authority","merit based ranking","optimized control flow","optimized reporting chain","respected authority figure","responsive authority system","responsive leadership model",
  "stable command structure","stable power structure","strategic leadership level","strong leadership core","structured leadership flow","structured leadership system","top tier decision making","transparent authority model",
  "transparent authority system","trusted decision maker","well ordered system","accountable command flow","aligned reporting system","capable authority network","clear decision authority","competent authority layer",
  "credible leadership core","defined reporting chain","efficient leadership structure","empowered decision layer","ethical authority structure","functional reporting flow","guided authority model","high trust hierarchy",
  "layered accountability system","legible power structure","merit based authority","principled leadership tier","rational command system","reliable reporting order","stable oversight layer","trusted leadership structure",
  "well governed system","abuse of authority","authority confusion","authority instability","authoritarian control","broken chain of command","centralized bottleneck","chaotic command flow",
  "command breakdown","conflicted authority","conflicted command structure","control imbalance","control without accountability","corrupt leadership","decision congestion","decision gridlock",
  "disconnected leadership","dominated structure","exploitative leadership","false authority figure","fragmented leadership","hidden power structure","hierarchy breakdown","hierarchy dysfunction",
  "inconsistent authority","ineffective management layer","leadership instability","leadership vacuum","manipulated authority","misaligned hierarchy","opaque hierarchy","oppressive system",
  "overcentralized power","political hierarchy games","power concentration","power imbalance","role ambiguity","role instability","structural imbalance","structural inefficiency",
  "systemic control failure","top heavy structure","toxic power structure","unearned authority","unclear reporting structure","unchecked authority","unstable authority system","unstable power dynamic",
  "weak leadership tier","accountability gap","authority distortion","bloated management layer","command confusion","credibility vacuum","decision hoarding","dysfunctional reporting chain",
  "empty leadership role","hierarchical congestion","misused authority","opaque command flow","power hoarding","rank distortion","reporting confusion","rigid control model",
  "status manipulation","suppressed accountability","territorial leadership","top down dysfunction","unstable reporting chain","vacant oversight layer","authority distribution","authority framework",
  "authority level","chain of command","command framework","command layer","command structure","control model","decision hierarchy","decision structure",
  "hierarchical arrangement","hierarchical model","hierarchy structure","layered system","leadership tier","level of authority","management structure","organizational hierarchy",
  "organizational layout","organizational model","organizational tier","position level","positional order","power distribution","power structure","rank order system",
  "ranked structure","reporting model","reporting structure","role hierarchy","role structure","structural hierarchy","structural model","status level",
  "system structure","tiered system","vertical organization","authority map","chain structure","command arrangement","control arrangement","decision layer",
  "leadership map","management layer","order structure","oversight model","position structure","rank framework","reporting chain","responsibility layer",
  "role arrangement","status arrangement","tier model","vertical framework","accurate performance","controlled throughput","high efficiency output","high productivity state",
  "maximum output","maximum output stability","optimal performance state","optimized output flow","peak performance","precision throughput","refined throughput state","stable output rate",
  "sustained performance","efficiency degradation","inconsistent output","low efficiency output","low output rate","output collapse","output instability","performance breakdown",
  "performance decline","performance degradation","performance fatigue","reduced capacity","reduced throughput state","skill degradation","throughput instability","unstable output rate",
  "average output level","average output rate","baseline performance","baseline throughput","moderate efficiency","moderate output rate","normal capacity","normal throughput flow",
  "standard performance","steady output","steady output rate","typical performance","typical throughput level","variable output","variable throughput","anticipatory sequencing",
  "forward planning","forward timing alignment","future oriented thinking","long range planning","planned sequencing","prepared timing","strategic timing","synchronized sequencing",
  "temporal accuracy","time aligned action","desynchronized sequencing","erratic sequencing","late sequencing","missed timing","poor timing","reaction lag",
  "timing instability","timing mismatch","unsynchronized sequencing","active phase","active sequencing","current timeframe","current timing","operating period",
  "present cycle","present sequencing","running timing","time window","accountable operator","autonomous identity","disciplined individual","high agency mindset",
  "independent thinker","responsible actor","self directed individual","self directed operator","self regulated role","value aligned identity","value creator identity","dependent behavior",
  "disconnected identity","externalized responsibility","externally controlled role","identity confusion","low agency identity","misaligned identity","victim mindset","adaptive identity",
  "assigned identity","context dependent role","contextual identity","functional identity","functional role","operational role","role based identity","situational identity",
  "clear articulation","technical literacy","information control","harm awareness","domain mastery","temporal awareness","deep passion","easily bored",
  "drawn to the unseen","concise expression","system navigation","selective disclosure","dose precision","precision calibration","genuine affection","slow to engage",
  "sensitive to energy shifts","rapid comprehension","active listening","rapid troubleshooting","compartmentalization","tolerance tracking","advanced synthesis","schedule adherence",
  "strong attachment","quick loss of interest","finds symbolic meaning in events","audience awareness","code comprehension","operational silence","risk assessment","high resolution analysis",
  "pacing control","personal affinity","interprets signs instinctively","efficient problem solving","contextual framing","efficient debugging","need to know filtering","interaction awareness",
  "multi variable modeling","timing precision","emotional investment","short attention span","pattern recognition in randomness","adaptive tone control","tool proficiency","signal suppression",
  "nonlinear reasoning","natural attraction","needs constant stimulation","trusts intuition over logic","focused attention","message precision","platform fluency","noise injection",
  "contamination awareness","abstract generalization","cycle tracking","core interest","morning irritability","moves by inner knowing","conversational flow control","data interpretation",
  "obfuscation tactics","test verification","duration estimation","intrinsic motivation","guided by subtle cues","persuasive delivery","automation thinking","identity masking",
  "onset timing","signal extraction","latency sensitivity","preferred focus","slow to warm up","reads between realities","accurate judgment","narrative structuring",
  "alias management","duration awareness","noise isolation","throughput timing","valued pursuit","operates on instinct","strategic questioning","api awareness",
  "trace minimization","peak management","systems level thinking","interval management","meaningful connection","low morning tolerance","strong intuition","signal clarity",
  "version control discipline","metadata awareness","hydration control","deadline discipline","emotional resonance","attracted to ritual","technical fluency","pattern disruption",
  "nutrition awareness","edge case anticipation","priority scheduling","inner drive","easily frustrated","finds power in repetition","nonverbal awareness","interface mastery",
  "behavioral camouflage","sleep regulation","failure mode analysis","time blocking","personal obsession","quick to anger","builds personal systems","analytical depth",
  "emotional calibration","hardware familiarity","timing concealment","recovery planning","root cause isolation","task sequencing","enduring interest","prone to irritation",
  "charges actions with intent","creative application","timing sensitivity","network understanding","dead drop usage","withdrawal awareness","strategic foresight","rhythm alignment",
  "primary passion","uses structure for meaning","calm under pressure","conflict de-escalation","cybersecurity awareness","indirect communication","dependency awareness","decision under uncertainty",
  "phase recognition","favorite domain","reactive under pressure","believes words carry force","structured reasoning","diplomatic phrasing","encryption handling","layered messaging",
  "craving awareness","probabilistic reasoning","beloved activity","emotionally guarded","treats language as influence","resourceful thinking","boundary setting","cloud navigation",
  "code switching","trigger identification","heuristic refinement","critical timing","comfort pursuit","slow to trust","chooses phrasing deliberately","reliable performance",
  "intent alignment","database querying","cipher usage","environment control","algorithmic efficiency","lead time planning","identity alignment","hard to read",
  "uses speech as leverage","high retention","information filtering","encryption discipline","safe setting awareness","architectural clarity","lag analysis","personal calling",
  "relevance selection","process automation","key control","trusted supervision","scalable solutions","cadence control","dedicated interest","avoids vulnerability",
  "effortless coordination","engagement management","access gating","emergency readiness","robust design","temporal mapping","sustained enthusiasm","values hidden knowledge",
  "time efficient workflow","trust building","plausible deniability","overdose awareness","dynamic adaptation","event synchronization","heart driven focus","highly sensitive",
  "seeks deeper layers","goal oriented mindset","credibility signaling","performance tuning","narrative control","first aid awareness","feedback loop control","time compression",
  "natural inclination","easily overwhelmed","questions surface reality","systematic approach","rapport establishment","scalable design","naloxone awareness","iterative refinement",
  "time expansion","emotional priority","takes things personally","explores esoteric systems","independent judgment","modular thinking","insider risk awareness","mental state monitoring",
  "benchmark alignment","moment selection","signature interest","emotionally reactive","studies symbolic frameworks","continuous improvement","network expansion","algorithmic reasoning",
  "counter surveillance","behavioral regulation","performance maximization","timing calibration","self aligned pursuit","deeply affected","feels connected to cycles","detail oriented focus",
  "connection bridging","digital adaptability","route variation","legal awareness","operational tempo","preferred environment","tracks timing naturally","measured risk taking",
  "mutual value exchange","supply variability awareness","latency minimization","clock discipline","personal sanctuary","second guesses decisions","aligns with phases","social positioning",
  "software evaluation","redundancy planning","storage safety","turnaround speed","core attachment","mentally restless","moves with rhythm","cognitive flexibility",
  "influence mapping","tech stack alignment","label accuracy","complexity reduction","emotional anchor","loops on thoughts","understands flow","high accountability",
  "gatekeeper navigation","deployment awareness","secure channels","cross tolerance awareness","cycle efficiency","source of fulfillment","intentional practice","warm introductions",
  "build management","ephemeral communication","polysubstance awareness","resilience engineering","temporal consistency","internal reward","uses imagination as tool","refined technique",
  "follow up discipline","environment setup","data sanitization","pharmacology awareness","operational integrity","time budgeting","authentic enjoyment","needs control",
  "visualizes outcomes","contact retention","cross platform operation","metabolism awareness","flow timing","purpose alignment","dislikes uncertainty","projects intent mentally",
  "confident delivery","reputation management","log awareness","half life awareness","cognitive compression","self reinforcing habit","rigid preferences","builds inner scenarios",
  "rapid adaptation","brand consistency","data structuring","footprint reduction","harm reduction planning","pattern abstraction","delay mitigation","resists change",
  "shapes perception","operational clarity","cross group communication","signal processing awareness","shadow documentation","support network use","meta level reasoning","schedule resilience",
  "high value interest","structured mindset","comfortable with duality","performance consistency","cultural awareness","firmware handling","controlled exposure","medical consultation awareness",
  "knowledge transfer","time risk assessment","consistent attraction","people aware","accepts paradox","stakeholder alignment","psychological misdirection","honest self assessment",
  "teaching clarity","phase transition control","reads the room","expectation setting","intermediary use","conceptual mapping","socially observant","balances opposing forces",
  "clarity under pressure","command line fluency","gatekeeper leverage","framework construction","time horizon awareness","energy sensitive","sees both sides","direct negotiation",
  "dependency management","context stripping","boundary definition","long term pacing","picks up on tone","subtext recognition","update control","decoy signaling",
  "trade off evaluation","attracted to transformation","alignment checking","system monitoring","blind spot creation","signal prioritization","timing alignment","reinvents identity",
  "conversation steering","technical documentation usage","fragmented knowledge","outcome prediction","sequence integrity","craves validation","moves through phases","information synthesis",
  "debugging persistence","controlled access tiers","constraint navigation","temporal structure","enjoys recognition","embraces change","public speaking control","feature implementation",
  "synthesis under pressure","continuity control","needs feedback","digital problem solving","responds to praise","protective of energy","withdraws under stress","guards personal space",
  "shuts down emotionally","filters influences","goes silent","avoids draining inputs","avoids confrontation","maintains boundaries","retreats inward","drawn to mystery",
  "mood dependent","prefers the unknown","emotion driven","explores hidden paths","shifts quickly","resists definition","unpredictable tone","operates outside norms",
  "energy fluctuates","creates meaning","loyal to a fault","assigns significance","protective of close ones","builds personal mythology","hard to let go","links events symbolically",
  "deep attachment","constructs inner systems","stays through conflict","comfortable alone","independent by default","uses solitude productively","self reliant","reflects deeply",
  "processes internally","values autonomy","builds inner world","prefers control","comfort driven","avoids discomfort","seeks ease","low resistance tolerance",
  "needs stability","driven when focused","all or nothing effort","locks in deeply","intense bursts of effort","strategic ambiguity","controlled transparency","measured escalation",
  "silent leverage","information asymmetry","narrative positioning","signal dominance","pattern inversion","context override","intent buffering","perception anchoring",
  "temporal stacking","priority distortion","selective amplification","meaning extraction","frame shifting","outcome biasing","decision layering","cognitive partitioning",
  "symbolic encoding","interpretive control","subtext injection","reality filtering","attention steering","perceptual gating","behavior shaping","expectation bending",
  "concept fusion","dual channel thinking","abstract layering","nonlinear mapping","mental simulation","idea synthesis","logic distortion","heuristic pruning",
  "insight stacking","knowledge compression","model abstraction","feedback sculpting","error anticipation","constraint bending","scenario modeling","system mirroring",
  "causal tracing","complexity folding","variable isolation","outcome projection","probability shaping","risk absorption","decision compression","time dilation awareness",
  "cycle anticipation","phase alignment","delay tolerance","momentum capture","timing disruption","window exploitation","sequence locking","pacing manipulation",
  "energy budgeting","rhythm control","latency masking","temporal discipline","impulse suppression","recovery spacing","sustained pacing","flow interruption",
  "pressure modulation","trigger control","emotional gating","attachment regulation","conflict containment","affective buffering","impulse redirection","mood stabilization",
  "reaction dampening","stress compartmentalization","desire filtering","emotional encoding","internal calibration","intensity scaling","connection filtering","boundary enforcement",
  "trust gating","distance calibration","social mirroring","influence buffering","alliance mapping","reputation shielding","expectation management","interaction pruning",
  "signal reading","status positioning","power balancing","reciprocity control","engagement pacing","loyalty testing","exposure limitation","narrative shielding",
  "identity partitioning","role shifting","persona layering","self observation","internal referencing","belief auditing","bias recognition","ego containment",
  "identity anchoring","autonomy reinforcement","self direction","value calibration","inner coherence","meaning construction","behavioral scripting","habit encoding",
  "routine stabilization","action stacking","discipline reinforcement","consistency tracking","output scaling","performance calibration","efficiency tuning","focus narrowing",
  "distraction elimination","error correction","iteration control","quality assurance","system building","workflow structuring","signal processing","encryption mindset",
  "access control","network mapping","interface fluency","automation layering","debugging discipline","architecture planning","redundancy design","security awareness",
  "load balancing","failure anticipation","recovery structuring","edge case handling","scalability planning","very secretive","always late","punctual individual",
  "uses people","rarely friendly","athletic build","broad shoulders","skinny frame","needs clarity","needs focus","needs patience",
  "needs work","reliable networker","very cleanly","very messy","useful in labor","magic user","often evil","kind a lot",
  "sees auras","natural oracle","highly guarded","chronically delayed","time conscious operator","social manipulator","socially distant","wide set frame",
  "lean physique","requires direction","requires discipline","requires restraint","requires effort","strong connector","immaculate habits","disorganized environment",
  "manual task capable","ritual practitioner","morally ambiguous","consistently benevolent","perceptive to subtle fields","intuitive interpreter","emotionally sealed","pattern of delay",
  "precision timed","exploits connections","low warmth baseline","heavy upper frame","lightweight structure","seeks definition","seeks alignment","seeks tolerance",
  "seeks development","high value contact builder","order driven habits","physically dependable","symbolic operator","dark leaning intent","compassion forward","energetically perceptive",
  "instinctive diviner","information restrictive","misses deadlines","clock aligned","instrumental with others","limited approachability","sport trained body","thick torso build",
  "slender composition","needs specification","needs structure","needs endurance","needs improvement","strategic network asset","sterile environment keeper","clutter prone",
  "workhorse capacity","arcane practitioner","shadow oriented","habitually kind","field sensitive perception","inner guided reader","linear reasoning","sequential logic",
  "parallel processing thought","causal inference","deterministic logic","inductive patterning","deductive structuring","abductive inference","analogical mapping","heuristic driven judgment",
  "rule based analysis","principle centered thinking","constraint aware reasoning","context sensitive evaluation","abstract formulation","concrete reasoning","symbolic manipulation logic","reductionist analysis",
  "comparative reasoning","counterfactual modeling","predictive inference","retrospective analysis","forward chaining logic","backward chaining logic","evidence weighted judgment","bias resistant reasoning",
  "noise tolerant inference","signal focused evaluation","trade off aware reasoning","multi variable analysis","recursive reasoning","meta cognitive processing","self referential logic","fractal pattern recognition",
  "boundary aware thinking","high coherence reasoning","low coherence reasoning","rapid inference cycles","slow deliberative logic","precision oriented thinking","ambiguity tolerant reasoning","ambiguity averse logic",
  "structured deduction","unstructured exploration","decision theoretic reasoning","game theoretic thinking","risk calibrated judgment","outcome oriented logic","process oriented reasoning","clear headed reasoning",
  "sharp inference pattern","quick to synthesize","slow but thorough logic","evidence driven thinking","intuition backed judgment","pattern sensitive reasoning","detail oriented analysis","big picture framing",
  "context aware interpretation","balanced evaluation style","decisive conclusion making","hesitant but careful reasoning","consistent logical structure","adaptive thinking model","flexible inference approach","rigid rule based logic",
  "exploratory reasoning style","insight heavy processing","grounded decision logic","emotion filtered reasoning","emotion influenced judgment","calm analytical baseline","reactive thought pattern","impulsive inference style",
  "tactical reasoning focus","long term oriented logic","short term decision framing","high signal detection","noise prone interpretation","assumption checking mindset","cause and effect awareness","correlation based thinking",
  "principle aligned reasoning","experience driven judgment","theory first thinking","practice first reasoning","earned trust","silent resentment","mutual recognition","unspoken agreement",
  "growing distance","shifting power balance","calculated vulnerability","strategic withdrawal","reciprocal loyalty","managed expectations","deliberate avoidance","performative harmony",
  "conditional support","negotiated respect","competing commitments","shared silence","deferred confrontation","tactical generosity","uneven investment","fragile alliance",
  "calculated kindness","withheld approval","testing loyalty","keeping options open","lowering defenses slowly","performed interest","guarded optimism","strategic forgetfulness",
  "redirecting blame","claiming neutrality","rehearsed empathy","managing perceptions","saving face","offering leverage","withdrawing attention","escalating gently",
  "bartering affection","matching effort exactly","holding back","testing boundaries","feigning ignorance","overcompensating visibly","shifting allegiances","downplaying conflict",
  "delaying commitment","habitual deception","chronic avoidance","performative virtue","quiet betrayal","selective memory","convenient principles","broken promises ignored",
  "self excusing pattern","shifting blame outward","emotional stinginess","refusal to apologize","rewriting shared history","privileging own comfort","withholding due credit","feigning helplessness regularly",
  "strategic incompetence","loyalty until inconvenience","kindness with terms","generosity as debt","accountability for others only","forgiveness for self","admiration for appearance","contempt for weakness",
  "entitlement disguised as need","resentment nursed privately","jealousy masked as concern","weaponized vulnerability","chronic promise breaking","moral licensing","selective outrage","virtue hoarding",
  "convenient amnesia","self deception mastered","punishing honesty","rewarding flattery","quitting when costly","blaming circumstance forever","never the villain","always the victim",
  "forgiving self instantly","judging others harshly","taking without asking","giving to control","helping to indebted","listening to reply","apologizing without change","admitting fault never",
  "learning nothing new","trusting only mirrors","respecting selectively","explaining away harm","feigning ignorance routinely","testing loyalty needlessly","withholding forgiveness deliberately","demanding trust unconditionally",
  "offering trust never","keeping score silently","resenting unspoken expectations","claiming misunderstanding often","escaping accountability gracefully","performing remorse poorly","repeating offenses calmly","ignoring feedback entirely",
  "celebrating small decencies","excusing large cruelties","nursing grudges indefinitely","forgetting debts conveniently","remembering slights perfectly","giving warnings subtly","striking without warning","smiling while sabotaging",
  "praising to disarm","flattering to exploit","apologizing to end discussion","changing subject skillfully","decay sets in","growth resumes slowly","rot spreads inward","spring follows winter",
  "cracks deepen daily","scars form over","wounds close up","drained their goodwill","took without asking","forgot their birthday","borrowed their car","never said thank you",
  "asked for favors constantly","returned nothing back","left them waiting","ignored their advice","spent their money freely","missed their important day","changed plans last minute","cancelled via text message",
  "showed up hours late","did not apologize ever","stole from them","robbed money","stole assets","gave away things","irreversible event","fixed point in time",
  "resolved situation","finalized event","completed sequence","terminated process","concluded scenario","expired action","ended phase","closed interval",
  "sealed outcome","observed outcome","witnessed event","experienced moment","recalled incident","reported case","verified history","confirmed past",
  "control disguised as care","silent treatment as punishment","keeping score of past mistakes","conditional affection","withholding communication","deflecting accountability","chronic criticism","backhanded compliments",
  "public disrespect","private resentment","gaslighting perceptions","jealousy framed as loyalty","ultimatums over dialogue","blame shifting","emotional withdrawal","passive aggressive remarks",
  "invalidating feelings","avoiding difficult conversations","breaking trust repeatedly","overstepping boundaries","ignoring boundaries","manipulation through guilt","playing victim to avoid fault","inconsistent behavior",
  "hot and cold attention","refusing to apologize","comparing to others","testing loyalty constantly","controlling decisions","monitoring independence","disrespecting time","chronic unreliability",
  "financial secrecy","emotional dependency pressure","using silence to dominate","cheating on them","someone is cheating","secretive texts","talking to ex","covert agenda",
  "masked intention","subtle manipulation","concealed motive","quiet control","disguised influence","hidden resentment","unspoken expectation","passive compliance",
  "strategic omission","selective honesty","partial disclosure","information hoarding","behind the scenes steering","indirect pressure","emotional undercurrent","veiled criticism",
  "double meaning speech","feigning innocence","calculated silence","timed withdrawal","soft coercion","micro manipulation","implied threat","nonverbal signaling",
  "coded language use","shadow negotiation","invisible boundary setting","subconscious testing","quiet triangulation","false transparency","curated persona","hidden alliance",
  "influence without ownership","detached observation","internal scoring","behavioral masking","covert misconduct","clandestine violation","hidden breach","unauthorized action",
  "illicit operation","backchannel dealing","off record behavior","concealed infraction","unreported incident","stealth exploitation","shadow dealing","quiet collusion",
  "undisclosed conflict of interest","falsified record","data manipulation","document tampering","evidence suppression","obstruction of oversight","circumvention of controls","policy evasion",
  "compliance breach","insider misuse","abuse of access","privilege escalation","unauthorized disclosure","information leakage","misappropriation of assets","diversion of funds",
  "kickback arrangement","bribery attempt","fraudulent activity","deceptive practice","identity misuse","impersonation","account compromise","cover up effort",
  "witness intimidation","record alteration","backdated entry","ghost transaction","phantom billing","shell arrangement","front operation","underground exchange",
  "off books transaction","side agreement","hidden liability","unlawful concealment","surreptitious conduct","under the table exchange","off ledger activity","quiet fraud",
  "hidden embezzlement","concealed laundering","untraceable transfer","backdated authorization","forged approval","fabricated documentation","tampered audit trail","suppressed reporting",
  "obfuscated records","data scrubbing","log deletion","metadata manipulation","chain of custody breach","evidence planting","false attestation","misstated figures",
  "revenue inflation","expense padding","invoice splitting","double billing","phantom vendor","ghost payroll","timecard fraud","procurement collusion",
  "bid rigging","price fixing","kickback channel","self dealing","nepotistic hire","crony contract","insider trading","front running",
  "market manipulation","wash trading","spoofing orders","account takeover","credential harvesting","keylogging scheme","unauthorized surveillance","covert monitoring",
  "backdoor access","rootkit installation","privilege abuse","shadow account","alias operation","sockpuppet network","astroturfing campaign","disinformation seeding",
  "coordinated inauthentic behavior","deepfake deployment","identity spoofing","account laundering","stolen asset liquidation","diversion scheme","asset stripping","hidden encumbrance",
  "off balance sheet liability","side letter arrangement","non arm length deal","quiet settlement","hush payment","sealed agreement","forum shopping","jurisdiction hopping",
  "sanctions evasion","smuggling conduit","contraband routing","black market exchange","underground brokerage","proxy ownership","nominee account","trust concealment",
  "shell layering","circular transactions","round tripping","false flag operation","covert sabotage","industrial espionage","trade secret theft","confidential leak",
  "source exposure","witness tampering","perjury coordination","jury interference","obstruction scheme","evidence destruction","hidden attraction elsewhere","unresolved past attachment",
  "emotional affair","physical infidelity","secret messaging thread","deleted conversations habit","alternate account use","compartmentalized life","double dating pattern","parallel relationship",
  "maintained backup options","flirtation minimization","private admiration fixation","selective disclosure of history","omitted encounters","concealed boundaries","unspoken dealbreakers","hidden expectations",
  "covert comparison to others","idealizing someone else","emotional investment outside","secret resentment buildup","internal scorekeeping","unvoiced dissatisfaction","passive exit planning","testing alternatives quietly",
  "financial concealment","hidden debt","secret spending","private subscriptions","location withholding","time alibi fabrication","routine inconsistencies","unexplained absences",
  "friends kept separate","family information withheld","social circle segmentation","image management online","curated persona mismatch","different behavior in private","selective truth framing","deflection patterns",
  "blame redistribution","intimacy avoidance","withheld affection","conditional warmth","control through silence","jealous monitoring","device guarding","password secrecy escalation",
  "sudden privacy shifts","boundary violations concealed","third party triangulation","confiding in outsiders first","leaking private details","testing loyalty covertly","recording arguments secretly","keeping evidence logs",
  "planning exit without notice","legal or housing plans hidden","relocation consideration hidden","future misalignment concealed","parallel identity curation","selective memory editing","truth staging","omission by design",
  "micro lie stacking","half truth deployment","plausible deniability framing","preemptive justification building","conflict rehearsing","scripted apologies","timed affection bursts","intermittent reinforcement",
  "reward withdrawal cycling","emotional breadcrumbing","future faking","commitment mirage","exit ramp preparation","fallback partner positioning","soft breakup seeding","gradual disengagement",
  "intimacy rationing","vulnerability gating","attachment testing","boundary probing","rules that shift","double standards enforcement","authority assertion without consent","decision pre commitment",
  "choice illusion offering","agenda setting in private","outcome steering quietly","conversation redirection loops","topic shutdown cues","stonewalling intervals","delay tactics","information drip control",
  "narrative monopolizing","alliance building behind the scenes","reputation pre framing","preemptive blame assignment","image laundering","selective transparency windows","privacy escalation spikes","device access asymmetry",
  "account compartmentalization","location opacity","schedule padding","time displacement explanations","unverifiable errands","unaccounted gaps","contact name masking","notification filtering",
  "channel switching","ephemeral messaging reliance","content purging cycles","archive hiding","search history control","financial partitioning","cash channel usage","off plan expenditures",
  "subscription concealment","shared asset ambiguity","debt minimization narratives","resource gatekeeping","support withholding","empathy throttling","validation rationing","affection on demand",
  "cold warm oscillation","jealousy induction","comparison seeding","insecurity triggering","loyalty trials","confession fishing","information harvesting","data retention for leverage",
  "evidence banking","argument recording","quote weaponization","past dredging","grievance stockpiling","forgiveness without reset","apology inflation","responsibility deflection",
  "intent vs impact inversion","gaslight cycles","reality reframing","minimization patterns","overgeneralization attacks","character labeling","projection loops","moral high grounding",
  "victim stance rotation","crisis fabrication","urgency pressure","ultimatum staging","exit threats","breakup rehearsal","return bargaining","cycle repetition",
  "pre scheduled action sequence","next phase deployment plan","forward timed operation set","planned interval activation","future cycle alignment","scheduled progression path","past executed action record","completed phase summary",
  "previous cycle breakdown","historical action log","retrospective timeline review","elapsed phase analysis","post action evaluation set","active phase operation","real time task engagement","current cycle alignment",
  "live sequence deployment","present moment coordination","real time adjustment loop","short term action framework","near future task queue","immediate next step plan","hour based planning grid","day structured action map",
  "instant deployment setup","compressed timeline strategy","short window coordination","extended cycle planning","multi phase deployment structure","future horizon alignment","year scale progression model","long range task sequencing",
  "end state oriented timeline","cumulative action mapping","conditional time trigger plan","event based action sequence","if then time alignment","deadline contingent action","phase dependent decision path","scheduled fallback sequence",
  "threshold based activation plan","cyclical time based system","daily routine framework","weekly action loop","monthly progression cycle","seasonal adjustment plan","recurring interval mapping","cycle reset action plan",
  "delayed action structure","time offset activation","staggered task deployment","buffered timeline strategy","delayed trigger sequence","pause resume action plan","latency adjusted workflow","future action plan",
  "scheduled next step","forward timeline","past action record","completed task log","previous outcome","action history","active task state","real time action",
  "short term plan","next step action","immediate task","long term plan","extended timeline","future roadmap","strategic sequence","end goal plan",
  "conditional trigger","event based step","time gated move","threshold action","daily cycle","weekly loop","monthly plan","repeat sequence",
  "deferred step","time offset task","staggered plan","early start action","ahead of time move","lead time activation","buffered start plan","exact window action",
  "deadline aligned move","precision timed step","late window action","post deadline move","missed window recovery","within margin action","inside window step","tolerance aligned move",
  "edge case timing","boundary window action","pre margin buffer","time cushion plan","safety window step","over margin drift","time overrun action","excess duration step",
  "tight margin timing","narrow window action","precision bound step","wide margin timing","flex window action","high tolerance step","margin corrected action","time offset correction",
  "realigned window step","timing compensated move","completed action","executed step","finished task","resolved operation","prior action taken","previous step executed",
  "earlier task handled","former action applied","already completed","pre finished step","done in advance","handled beforehand","resolved earlier","just completed",
  "recently executed","freshly finished","newly resolved","just handled","long completed action","previously finalized","historically executed","old task closure",
  "repeated past action","previous pattern applied","cycle already run","prior loop executed","routine completed","corrected past action","error adjusted step","fixed prior outcome",
  "missed past action","skipped step","unhandled task","dropped sequence","delayed past action","post deadline completion","belated step","tracked completion",
  "sudden disruption","gradual shift","unexpected outcome","predictable pattern","controlled incident","major escalation","isolated event","chain reaction",
  "systemic failure","brief interruption","extended duration","rapid onset","slow buildup","delayed impact","critical moment","turning point",
  "breaking event","decisive shift","defining incident","rare anomaly","recurring pattern","one time event","cyclical phase","high impact event",
  "low level activity","subtle change","moderate fluctuation","planned operation","unplanned incident","coordinated action","contained situation","spreading effect",
  "localized issue","widespread impact","global shift","volatile phase","balanced state","unstable period","resolved event","ongoing situation",
  "unfolding scenario","concluded incident","pending outcome","successful completion","goal achieved","milestone reached","target met","objective fulfilled",
  "promotion secured","deal closed","contract signed","partnership formed","client acquired","award received","recognition earned","record broken",
  "competition won","ranking improved","conflict resolved","issue fixed","problem eliminated","error corrected","system restored","skill mastered",
  "knowledge gained","training completed","certification earned","ability improved","relationship strengthened","trust established","support received","connection formed",
  "reconciliation achieved","opportunity seized","timely decision made","risk paid off","breakthrough realized","advantage gained","financial gain realized","income increased",
  "debt reduced","asset acquired","investment returned","health improved","recovery completed","energy restored","habit established","consistency maintained",
  "project delivered","deadline met","plan executed","strategy validated","outcome optimized","task failed","goal missed","deadline broken",
  "target unmet","plan collapsed","deal lost","contract voided","client dropped","partnership ended","opportunity missed","error made",
  "mistake repeated","system failed","process broke","output degraded","conflict escalated","argument triggered","trust broken","relationship strained",
  "communication failed","loss incurred","money lost","debt increased","asset depleted","investment failed","injury sustained","health declined",
  "recovery delayed","energy depleted","condition worsened","project delayed","timeline slipped","milestone skipped","progress stalled","rule violated",
  "policy breached","standard ignored","compliance failed","penalty applied","misjudgment made","poor decision taken","risk misread","signal ignored",
  "warning missed","reputation damaged","credibility lost","trust reduced","influence weakened","standing lowered","projected outcome","expected result",
  "anticipated shift","forecasted event","scheduled rollout","planned launch","upcoming release","future deployment","set activation","likely success",
  "probable gain","expected growth","projected increase","positive trend","possible failure","risk exposure","potential loss","forecasted decline",
  "negative outlook","deadline approaching","target window nearing","cutoff approaching","next phase initiation","stage transition pending","cycle shift expected","phase change ahead",
  "progression trigger set","opportunity emerging","window opening","advantage forming","access increasing","entry point appearing","challenge incoming","pressure building",
  "constraint forming","obstacle ahead","resistance expected","system upgrade pending","process improvement planned","efficiency increase expected","performance boost projected","long term expansion",
  "future scaling","growth trajectory set","capacity increase planned","extended development path","predictive onset cue","near term arrival indicator","forward looking transition sign","impending shift notice",
  "early warning transition signal","pre transition diagnostic","forward event precursor","incoming phase alert","looming development cue","near future state predictor","advance change indicator","preparatory arrival signal",
  "forward shift trigger","upcoming state transition","near term development sign","forward phase indicator","bodily features","needs of","wants for","possessions accumulated",
  "actions taken","intents for","feelings towards","gives gifts","gets gifted","blind in one eye","has sex often","rarely has sex",
  "does math well","bad at math","has a lip ring","has earrings","argues a lot","self absorbed","identity holder","decision maker",
  "internal observer","self regulator","inner narrator","income generator","resource allocator","risk evaluator","problem resolver","stability maintainer",
  "romantic partner","loyal friend","family member","active caregiver","emotional dependent","group leader","active follower","conflict mediator",
  "direct competitor","trusted ally","continuous learner","practical teacher","curious explorer","system creator","long term strategist","forward planner",
  "task organizer","rule enforcer","system maintains","performance evaluator","clear communicator","social performer","personal storyteller","creative artist",
  "meaning interpreter","manipulator","pattern avoider","self sabotaging agent","identity masker","silent observer","working employee","employer",
  "active student","paying customer","asset owner","unknown stranger","present role executor","future state planner","parent figure","authority parent",
  "nurturing parent","strict disciplinarian","protective guardian","supportive partner","dominant partner","dependent partner","conflicted partner","older sibling leader",
  "younger sibling dependent","protective sibling","competitive sibling","absent sibling","primary caregiver","secondary caregiver","emotional caretaker","financial provider",
  "household manager","family mediator","conflict initiator","peace keeper","boundary setter","responsible child","rebellious child","overlooked child",
  "favored child","burdened child","role model figure","black sheep member","scapegoated member","golden child role","invisible member","elder advisor",
  "family historian","tradition keeper","legacy builder","end of line carrier","mother","father","parent","stepmother",
  "stepfather","son","daughter","child","stepchild","brother","sister","sibling",
  "half brother","half sister","grandmother","grandfather","grandparent","grandson","granddaughter","grandchild",
  "aunt","uncle","niece","nephew","cousin","spouse","husband","wife",
  "partner","mother in law","father in law","parent in law","brother in law","sister in law","son in law","daughter in law",
  "guardian","ward","take control","make a decision","set a boundary","hold position","change direction","start the process",
  "stop the action","pause briefly","resume movement","end the cycle","build structure","break pattern","shift focus","adjust timing",
  "refine output","gain access","lose access","grant permission","deny entry","restrict movement","create value","reduce waste",
  "increase effort","limit exposure","balance input","observe quietly","analyze patterns","measure results","track progress","verify accuracy",
  "lead forward","follow direction","support others","challenge authority","negotiate terms","form connection","cut ties","repair damage",
  "restore trust","test loyalty","hide intent","reveal truth","mask identity","signal awareness","plan ahead","react quickly",
  "adapt rapidly","anticipate change","prepare outcome","start of the year","early year period","first quarter phase","mid winter stretch","late winter period",
  "early spring phase","mid spring period","late spring stretch","start of summer","early summer phase","mid summer peak","late summer period","early fall phase",
  "mid fall period","late fall stretch","start of winter","early winter phase","mid winter peak","late winter close","quarter one period","quarter two period",
  "quarter three period","quarter four period","first half of year","second half of year","pre holiday period","holiday season window","post holiday period","fiscal year start",
  "fiscal year end","anniversary date window","year end closing period","winter phase","early winter","mid winter","late winter","spring phase",
  "early spring","mid spring","late spring","summer phase","early summer","mid summer","late summer","fall phase",
  "early fall","mid fall","late fall","you already knew","the doubt is the signal","your body is warning you","you have questions","been here before",
  "the fear is yours","you are being tested","something resists","the grief belongs to you","close to breaking","trust what you felt","unseen authority","implicit control structure",
  "hidden order system","inaudible command network","subtle dominion field","invisible rule set","covert influence grid","nonverbal power structure","too close","too far",
  "almost there","not yet there","just arrived","just left","on the edge","off the edge","inside boundary","outside boundary",
  "within range","out of range","in transition","out of transition","mid crossing","pre crossing","post crossing","between points",
  "near limit","far from limit","approaching edge","receding from edge","just inside","just outside","barely within","clearly outside",
  "on boundary line","off boundary line","in the gap","out of the gap","entering zone","exiting zone","pre entry","post exit",
  "mid passage","stalled midway","ahead of boundary","behind boundary","on the verge","at the brink","in the doorway","on the cusp",
  "mid shift","pre emergence","post dissolution","in suspension","in flux","mid recalibration","on the hinge","in latency",
  "pre stabilization","post disruption","in drift","on standby","mid formation","in transit","pre crystallization","post transition",
  "self defined individual","role based persona","externally validated identity","internally constructed self","adaptive social mask","fixed character profile","fluid self concept","layered personality structure",
  "public facing identity","private inner self","inherited identity frame","self authored narrative","situational identity shift","core identity anchor","fragmented self image","integrated identity model",
  "projected persona construct","perceived social role","unresolved identity state","emergent self pattern","breath held","chest tight","jaw clenched","hands open",
  "shoulders lowered","eyes averted","throat closed","stomach dropped","spine aligned","fists unclenched","neck stiff","brow furrowed",
  "lips pressed","teeth set","palms sweating","fingers twitching","gaze fixed","eyes widened","pulse racing","breath slowed",
  "breath shallow","chest expanded","jaw relaxed","hands clenched","shoulders raised","eyes closed","throat open","stomach knotted",
  "spine curved","fists tightened","neck relaxed","brow smoothed","lips parted","teeth grinding","palms dry","fingers still",
  "gaze shifting","eyes narrowed","left unspoken","never questioned","did not need","words restrained","said just enough","nearly spoken",
  "silence maintained","meaning inferred","kept internal","left unresolved","almost revealed","intention implied","message indirect","unstated agreement",
  "unasked question","unvoiced thought","subtext carried","nothing declared","barely implied","left hanging","unanswered still","almost answered",
  "never voiced","quietly held","kept beneath","not brought up","held in reserve","signal muted","message softened","truth deferred",
  "left between lines","hinted only","spoken indirectly","kept unsaid still","not fully stated","left for inference","meaning unspoken","cause initiated",
  "effect produced","trigger activated","outcome realized","action driven","resulting state","input transformed","output generated","cascading impact",
  "following consequence","source event","derived result","resultant shift","process unfolding","end state formed","influence exerted","reaction induced",
  "root cause identified","proximate cause triggered","downstream effect observed","secondary outcome formed","tertiary impact emerging","driving force applied","intervening variable active","feedback loop engaged",
  "runaway escalation","threshold crossed","tipping point reached","lagged effect appearing","compounding influence building","residual impact persisting","spillover effect occurring","indirect consequence arising",
  "knock on effect spreading","terminal outcome fixed","same routine every day","asks for exact deadlines","uses only bullet points","solves problems alone first","measures deliverables not hours","arrives two minutes early",
  "turns tasks into checklists","adds buffer days","shares budgets and delays openly","changes mind with data only","answers weekend in one sentence","replaces soon with a date","sends recaps after meetings","ships working prototypes",
  "follows a fixed review checklist","rejects most first drafts","learns from docs not people","hires for portfolio not years","closes all other tabs","same lunch time daily","phone in another room","explains action before doing it",
  "finishes one task before next","double checks all numbers","carries backup charger and cash","traces problems back three steps","waits before replying","protects time for high impact work","early phase","late phase",
  "on time","ahead of time","behind schedule","right moment","wrong moment","just in time","initial stage","terminal stage",
  "peak period","low period","midpoint phase","pre phase","post phase","in the moment","arrives ahead of schedule consistently","falls behind without clear recovery",
  "adjusts timing based on feedback","misreads timing under pressure","keeps pace with changing demands","loses track of time easily","operates within strict time limits","extends tasks beyond necessity","rushes decisions without pause","delays action despite readiness",
  "matches tempo of the environment","breaks rhythm under stress","maintains steady timing control","reacts late to emerging signals","anticipates shifts before they occur","hesitates despite adequate information","keeps strict adherence to timelines","abandons schedule under pressure",
  "overextends duration without added value","recovers timing after initial delay","operates ahead of group synchronization","lags behind coordinated efforts","misses critical windows of opportunity","aligns actions with unfolding sequences","breaks sequence continuity under strain","exits before resolution is achieved",
  "tracks time with precise awareness","sharp attention to detail","limited awareness of context","strong sense of direction","unclear internal guidance","high tolerance for pressure","low resistance to stress","consistent follow through on tasks",
  "frequent abandonment of plans","clear communication under tension","difficulty expressing intent","balanced emotional regulation","steady decision making process","erratic judgment under strain","scattered approach to effort","rigid adherence to routine",
  "accurate self assessment ability","distorted perception of capability","sharp facial features","soft rounded features","defined jawline structure","subtle jawline contour","clear skin texture","weathered skin surface",
  "steady direct gaze","wandering unfocused gaze","upright balanced posture","slouched uneven posture","broad shoulder frame","narrow shoulder frame","lean body composition","stocky body build",
  "tall vertical presence","compact physical stature","symmetrical facial balance","asymmetrical facial structure","well groomed appearance","keeps motives concealed","guards personal history tightly","reveals little under pressure",
  "withholds critical details","deflects direct questioning","shares selectively when necessary","maintains layered narratives","hides intent behind humor","avoids disclosure of plans","signals without full explanation","protects sensitive information",
  "leaks hints without clarity","redirects attention when probed","compartmentalizes private matters","keeps past actions obscured","limits access to inner thoughts","reveals fragments not the whole","masks truth with ambiguity","controls narrative exposure",
  "keeps deeper meaning concealed","hides a second identity","conceals financial instability","keeps past affiliations buried","covers up legal trouble","maintains hidden relationship","denies prior commitments","hides true source of income",
  "conceals addiction patterns","keeps family conflict secret","withholds educational history","masks origin of resources","hides previous identity change","conceals disciplinary record","hides ongoing investigation","conceals digital footprint traces",
  "hides prior agreements","high risk occupation","low risk occupation","skill intensive role","low skill requirement role","client facing position","behind the scenes position","field based assignment",
  "office based assignment","physically demanding work","sedentary desk work","time sensitive role","flexible schedule role","shift based employment","project based contract","independent contractor role",
  "team dependent position","supervisory level role","entry level position","specialized technical role","general support function","strong preference for structure","seeks clear predictable outcomes","comfortable with uncertainty",
  "prefers minimal social interaction","thrives in group environments","leans toward independent work","prefers guided instruction","values speed over precision","prioritizes accuracy over speed","drawn to high intensity situations","prefers detailed planning processes",
  "operates with spontaneous decisions","seeks consistent daily routines","adapts to variable schedules","prefers direct communication style","avoids confrontation when possible","values privacy over transparency","leans toward open disclosure","situational role shifter",
  "boundary aware operator","threshold tuned responder","context switching specialist","signal reading communicator","latent pattern interpreter","phase aligned actor","constraint navigating thinker","adaptive identity formatter",
  "timing window observer","dynamic stance adjuster","subtle cue reader","environment scanning agent","precision framed speaker","internal state regulator","external pressure modulator","sequence aware planner",
  "feedback loop calibrator","ambiguity tolerant processor","multi layer perception user","tidal pull","root system","storm pattern","fault line","pressure point",
  "surface tension","magnetic field","decay rate","growth cycle","erosion path","sediment layer","water table","current direction",
  "wind resistance","thermal shift","density change","crystalline structure","wave frequency","resonance point","interference pattern","absorption rate",
  "reflection angle","refraction path","dispersion field","gravity well","orbital path","eclipse alignment","solar return","lunar phase",
  "tidal lock","polar shift","axis tilt","magnetic north","true north","deviation point","convergence zone","divergence field",
  "pressure front","cold front","warm front","stagnant air","moving mass","still water","deep current","surface current",
  "undertow","riptide","backwash","groundswell","time moves slowly","moment suspended","years compressed","days stretched thin",
  "the long wait","too long ago","not long enough","time collapsed","the wait continues","felt like forever","over before starting","no time left",
  "borrowed time","running out","just enough time","time well spent","time wasted here","lost years","found moment","stolen hour",
  "suspended between","caught mid stride","frozen in place","rushing past","slipping away","holding still","stretching forward","contracting back",
  "watching without acting","present but absent","seeing clearly now","chose not to look","looked away once","remembers everything","forgot on purpose","witnessed the moment",
  "overlooked the detail","noticed too late","saw it coming","did not want to see","refused to acknowledge","observed from distance","present at the scene","absent at the moment",
  "kept record of","bore witness to","testified to nothing","saw and said nothing","watched it happen","present without presence","invisible observer","silent recorder",
  "the one who stayed","the one who left","the one who watched","the one who spoke","the one who kept quiet","the one who came back","the one who never returned","the one who knew first",
  "the one who knew last","the one who caused it","the one who fixed it","the one who walked away","the one who arrived late","the first to fall","the last to leave","the one left standing",
  "the one who started it","the one who ended it","the one who carried it","the one who dropped it","the witness at the door","the keeper of the flame","the one who built the wall","the bridge between",
  "the gap between","the space between","the point of no return","the moment before","the moment after","the edge of knowing","the weight of it","the pull toward",
  "the push against","the hold on","the release of","the return to","the distance from","the pressure of","the absence of","the presence of",
  "the cost of knowing","the price of silence","the weight of memory","the burden of proof","the gift of doubt","the curse of certainty","the freedom of unknowing","the trap of clarity",
  "the mercy of forgetting","the danger of remembering","too much too soon","not enough not yet","exactly enough","slightly over","barely under","well within range",
  "far outside range","at the outer edge","at the inner core","surface level only","all the way through","halfway there","three quarters done","just past the midpoint",
  "approaching completion","receding from start","moving toward center","moving away from center","pulling inward","pushing outward","the body remembers","the body forgets",
  "the body knows first","the body speaks last","the body holds it","the body releases it","muscle memory active","muscle memory lost","cellular recognition","instinctive withdrawal",
  "instinctive approach","automatic protection","automatic opening","involuntary reaction","voluntary override","body before mind","mind before body","gut before thought",
  "thought before feeling","becoming aware","becoming numb","becoming certain","becoming lost","becoming clear","becoming confused","becoming present",
  "becoming distant","becoming still","becoming restless","becoming ready","becoming reluctant","moving toward resolution","moving toward collapse","approaching stillness",
  "approaching chaos","entering clarity","leaving certainty","crossing into unknown","returning to known","the first time","the second chance","the third attempt",
  "the fourth turning","the seventh cycle","the ninth hour","one more time","one last time","once and final","twice removed","three steps back",
  "four walls","five years gone","ten years forward","a hundred small moments","a thousand small cuts","the single thread","the double bind","the triple confirmation",
  "the zero point","yields under pressure","holds under pressure","bends without breaking","breaks without bending","resists without force","forces without resistance","pushes through anyway",
  "stops at the boundary","redirects the force","absorbs the impact","deflects the blow","compounds the pressure","releases the tension","builds the pressure","holds the tension",
  "collapses under weight","rises under weight","recovers from collapse","the first betrayal","the moment of recognition","the second look","the point of contact","the moment of separation",
  "the return of the familiar","the arrival of the unknown","the departure from safety","the sealing of the door","the opening of the path","the closing of the window","the turning of the tide","the shifting of the ground",
  "the breaking of the pattern","the restoration of order","the dissolution of form","the emergence of structure","at the edge of speech","in the middle of becoming","between two knowings","under the weight of waiting",
  "after the letting go","before the first word","inside the long silence","past the point of defending","beneath the noticing","chose to stay anyway","chose to leave instead","chose silence over war",
  "chose honesty over ease","chose the slower path","chose not to chase","chose to see it fully","chose the uncertain door","disputed ground","shared loss","unclaimed win",
  "borrowed credibility","stolen attention","inherited conflict","unearned rest","purchased loyalty","owed apology","forgiven debt","showed up anyway",
  "tried again slower","stopped trying to convince","stopped explaining","said less each time","said more than needed","kept going past the point","quit exactly on time","drew them closer",
  "held them at distance","mirrored their pace","broke their rhythm","matched their frequency","shifted their mood","anchored their instability","amplified their doubt","softened their edge",
  "sharpened their focus","owed a favor","owed an explanation","owed the truth","owed nothing back","owes only themselves","holds no debts","carries old promises",
  "keeps forgotten agreements","almost trusted them","almost believed it","almost asked why","almost told the truth","almost stayed quiet","almost walked away","almost admitted it",
  "almost let it go","almost stopped caring","almost forgave","waiting on certainty","waiting for clarity","waiting on one sign","waiting on permission","waiting on themselves",
  "stopped waiting finally","still waiting quietly","done waiting now","knows what they did","knows who they are","knows what they want","knows what they lost","knows they were wrong",
  "knows it was a mistake","knows and pretends not to","knows and cannot say","low grade tension","high frequency anxiety","slow burning resentment","fast moving doubt","steady held fear",
  "rising background joy","quiet persistent hope","flickering certainty","same story different year","different face same pattern","new name old lesson","familiar entry new exit","same wound different dressing",
  "new ground old question","different city same ache","before the funeral","the morning after","the night before","the first day alone","the last shared meal","the final phone call",
  "the beginning of the ending","held space for","made room for","closed the door on","opened a window to","built a bridge to","burned a bridge with","drew a line with",
  "crossed a line with","kept the door open","locked it all up","sure but quiet","unsure but loud","certain and wrong","uncertain but right","clear without proof",
  "clouded despite evidence","knows without knowing how","cannot unknow this","room felt wrong","air was heavy","silence was thick","light was strange","quiet was loud",
  "space was full","room was waiting","air shifted subtly","heard my own voice","watched myself doing it","caught myself thinking","stopped myself speaking","noticed the pattern again",
  "felt the old shape","recognized the setup","saw the trap forming","non-answer compliance","sounds cooperative stays evasive","fragmented narrativizing","weaponized confusion","keeps interaction murky to retain upper hand",
  "language inflation","bluntness as alibi","calls aggression honesty","chronic caveating","hyperexplicitness after rupture","unstated asks","escalates to regulate","conflict avoidance by appeasement",
  "yields quickly stores resentment","delayed eruption pattern","swallows early signals detonates later","punitive withdrawal","distance used as punishment","counterattack reflex","responds to hurt with offense","righteous flooding",
  "moral certainty rises with overload","conflict as intimacy","feels closest in charged states","conflict illiteracy","cannot separate disagreement from threat","repair avoidance","scorched-earth impulse","destroys ground once activated",
  "micro-retaliation pattern","distributes injury in deniable doses","scorekeeping mentality","tracks conflict like a ledger","historical stacking","absolutist escalation","exit threats as leverage","invokes departure to gain control",
  "submission then sabotage","complies outwardly resists covertly","values dominance over understanding","humiliation defense","reactive misattunement","hears attack where nuance exists","provocation seeking","rupture addiction",
  "familiar with chaos mistrusts calm","post-conflict amnesia","wants storm forgotten without repair","compelled clarification after rupture","truth dump under threat","becomes brutally accurate when cornered","conflict fogging","muddies specifics to escape ownership",
  "moral inversion in conflict","submission collapse","loses coherent voice under confrontation","freeze in confrontation","cognition drops when tension spikes","hyperarticulate fighting","fearful placation","vengeance drift",
  "contrarianity under shame","opposes because yielding feels annihilating","hostile compliance","performs agreement with embedded refusal","indirect contesting","repair longing repair incapacity split","shame-rage sequence","exposure quickly converts into anger",
  "correction intolerance","feedback feels like ego injury","humiliation vigilance","scans for disrespect or diminishment","defensive superiority","contempt used to avoid inferiority","collapse under criticism","minor critique triggers major self-loss",
  "counterphobic pride","acts fearless to suppress shame","prestige dependence","needs esteem to stay organized","concealed inadequacy complex","image or achievement covers defectiveness","injury memorization","pride rigidity",
  "cannot soften without feeling lowered","apology resistance","remorse threatens self-structure","false modesty defense","self-deprecation used to preempt attack","pre-shaming self","insults self before others can","perfectionistic shame management",
  "tries to become uncriticizable","shame by comparison","collapses near perceived superiority","defensive preciousness","ordinary friction feels disproportionately wounding","grandiosity after diminishment","self-inflation follows ego wound","self-exonerating pride",
  "protects innocence over truth","moral vanity","competence narcissism","exposure dread","fragile distinction needs","requires specialness to outrun worthlessness","shame-driven generosity","shame-fueled overachievement",
  "performs to silence inner accusation","dignity deficit","self-reproach loop","turns mistakes into character indictment","prickly self-regard","highly reactive to puncture","brittle confidence","appears solid until challenged",
  "invisible shame posture","body and language apologize without words","honor fixation","affective flooding","emotion rises faster than regulation","affective blunting","mood-governed functioning","emotional weather dictates behavior",
  "suppressed grief field","sorrow is present but unprocessed","anger as cover emotion","tear inhibition","body resists release even when pain is active","emotion phobia","treats feeling itself as dangerous","rage dependency",
  "anger provides temporary coherence","numbness as refuge","affective lability","tenderness inhibition","delayed emotional processing","borrowed affect","empathic overidentification","cannot distinguish resonance from takeover",
  "contagion susceptibility","atmosphere enters quickly","emotional underlabeling","feels strongly names poorly","sorrow saturation","grief becomes ambient background","displaced grief activity","pleasure guilt",
  "enjoyment triggers accusation","joy suspicion","hope aversion","avoids optimism to reduce disappointment","sentimental defensiveness","emotional inversion","reactive tenderness withdrawal","affect leakage",
  "unspoken feeling emerges through body timing or tone","emotionally top-heavy mind","underfelt anger","cannot access rightful aggression","overmobilized anger","anger arrives faster than thought","relief shame","feels guilty when burden lifts",
  "ambivalent longing","wants and fears nourishment simultaneously","threat-biased interpretation","fills ambiguity with danger","confirmation-hungry mind","notices what supports prior fear","projection-led perception","sees disowned material outside first",
  "black-and-white cognition","complexity collapses under stress","catastrophic forecasting","overestimates negative trajectory","narrative overfitting","pattern compulsion","suspicion priming","mind-reading bias",
  "infers intent without checking","interprets neutral events as self-referential","dichotomous moral parsing","cognitive rigidity","hyperanalytic distancing","thinks about rather than through","conspiracy susceptibility","hidden-order explanations soothe uncertainty",
  "symbolic overreach","emotion-as-evidence cognition","feels true therefore assumes true","data selectivity","attends to threat ignores repair","premature closure thinking","lands fast to avoid ambiguity","defensive certainty",
  "conviction rises where doubt lives","paranoid elaboration","interpretive inflation","self-referential filtering","nuance collapse under arousal","subtlety disappears when activated","meaning extraction drive","reality testing strain",
  "inner narrative outranks external feedback","conceptual grandiosity","psychological absolutism","treats tendencies like destinies","doubt intolerance","uncertainty itself feels unbearable","cognitive moralism","prefers rightness over accuracy",
  "elegant explanation addiction","beautiful theory displaces messy truth","interpretive vigilance","always reading beneath surfaces","negative filtering bias","good data fails to consolidate","hostile attribution style","harmful intent assumed readily",
  "hope-disqualifying cognition","neutralizes positive possibilities preemptively","intellectualization defense","substitutes analysis for contact","start-stop cycle","begins strongly cannot sustain","threshold collapse","self-sabotage by delay",
  "lets openings decay through postponement","success intolerance","progress becomes dysregulating","chaos loyalty","routine aversion","mistakes structure for entrapment","compulsive reset behavior","keeps beginning avoids continuing",
  "last-minute intensity dependence","mobilizes only under pressure","productive avoidance","procrastinative self-protection","delay prevents definitive self-measurement","collapse after momentum","perfectionism paralysis","impulse override failure",
  "white-knuckle discipline","boredom intolerance","abandons what lacks novelty","routine destabilization need","disrupts steadiness to feel alive","authority-reactive noncompliance","learned helplessness","underacts despite real agency",
  "agency diffusion","goal fog","action inhibition by shame","habit fragility","small disruptions break the system","overscheduling as anxiety management","productivity used to quiet chaos","underfunctioning in key domains",
  "recreational self-undoing","micro-avoidance architecture","pseudo-commitment","intention language without matching behavior","crisis dependency","threshold fear disguised as laziness","pleasure-first derailment","chooses relief over long-range integrity",
  "structural self-neglect","neglects basics that preserve stability","compulsive detouring","identity lag behavior","environmental defeatism","insight exceeds follow-through","delayed self-respect","behaves as though care can wait",
  "control-seeking under uncertainty","power used as anti-anxiety","micromanaging reflex","dominance compensation","control expands where helplessness lives","subtle authoritarianism","insists without appearing to insist","power through opacity",
  "dependency engineering","creates need to prevent abandonment","plausible-deniability control","moral high-ground domination","governs through righteousness","intellectual domination","emotional temperature control","withholding as power",
  "grants and retracts access strategically","access management","dispenses closeness like a reward","intermittent reinforcement style","inconsistency intensifies attachment","fragility as control","collapse used to halt challenge","helplessness performance",
  "becomes impossible to oppose","charm-based authority","influence routed through likability","status preoccupation","tracks rank constantly","submission extraction","prefers others softened apologetic uncertain","boundary testing as hierarchy check",
  "probes limits to gauge power","correction as dominance ritual","enjoys being the definitional authority","invisible ownership stance","acts as though others time or loyalty are owed","covert one-upmanship","tiny moves preserve superior position","decision monopolizing",
  "centralizes choice to reduce unpredictability","jealous territoriality","power panic when ignored","low attention feels like demotion","hierarchical sensitivity","influence dependency","control loss intolerance","uncertainty becomes aggression or panic",
  "sovereignty confusion","mistakes domination for self-possession","boundary porosity","boundary rigidity","overhardens after invasion","self-other blur","guilt-boundary conflict","limits feel cruel",
  "permission-based limits","delayed no","recognizes personal limits too late","overresponsibility for others feelings","intrusion normalization","boundary testing tolerance","boundary collapse under attachment threat","moralized self-sacrifice",
  "treats self-denial as goodness","self-abdicating care","reactive walling","goes from overopen to unreachable","overdisclosure without containment","privacy as self-preservation","secrecy built from insufficient safety","compulsive availability",
  "feels unable to stay inaccessible","relational overextension","commits beyond sustainable capacity","emotional trespass","enters others interiority without invitation","fixing compulsion","intervenes where witnessing would suffice","boundary shame hangover",
  "feels guilty after necessary assertion","reciprocity confusion","gives without assessing mutuality","enmeshment drift","self-negotiation habit","bargains against own instincts","containment deficit","cannot hold others affect without merging",
  "lack of internal perimeter","overguarded autonomy","reads ordinary closeness as encroachment","reciprocal unsafety","alternates between intrusion and concealment","boundary by disappearance","boundary theater","boundary maturation in progress",
  "narrative laundering","cleans harmful behavior through retelling","innocence management","reality softening","minimizes severity through diluted language","half-truth strategy","reveals enough to mislead","confusion manufacturing",
  "muddies facts when pinned down","proxy aggression","motive concealment","curated transparency","reputational buffering","victim repositioning","selective memory invocation","forgets where remembering is costly",
  "plausible misunderstanding posture","ethical compartmentalization","separates misconduct from self-image","image-first remorse","private-public split","persona and conduct diverge sharply","benevolence as leverage","kindness arrives with invisible debt",
  "covert hostility","aggression kept deniable","sweet sabotage","undermines while smiling","false reconciliation","semantic escape artistry","wriggles through technicalities","deniable cruelty",
  "compliance theater","truth rationing","controls information to control choice","moral camouflage","wears values as cover","selective principle use","invokes ethics only when useful","confession calibration",
  "reversal maneuver","compassion mimicry","performs empathy without embodied accountability","manipulative opacity","strategic softness","gentleness used to disarm scrutiny","relational triangulation","regulates two-person bonds through thirds",
  "secret-keeping for dominance","hoards information as currency","affective fraudulence","displays feelings not truly inhabited","integrity theater","speaks cleanly behaves opportunistically","rescuer compulsion","worth tied to intervening",
  "need-to-be-needed structure","feels secure only when indispensable","caretaking as control","self-erasing service","gives at cost of self-recognition","invisible contract giving","expects return without naming it","martyr economy",
  "suffering becomes moral claim","overfunctioning underreceiving split","rescue before consent","compulsive emotional labor","manages the room automatically","fixer identity","confuses support with repair ownership","boundaryless empathy",
  "absorbs then depletes","codependent stabilization","regulates self through regulating others","resentful devotion","love curdles when not mirrored","exhaustion-blind giving","notices depletion only after collapse","purpose through crisis exposure",
  "feels alive around emergencies","care as permission to belong","helping substitutes for being","guilt-driven generosity","gives to silence self-accusation","self-worth through usefulness","overattunement to need","detects others faster than self",
  "compelled soothing","relational overresponsibility","caretaking with covert claim","help arrives carrying ownership","rescue-induced dependency loops","solution-giving prevents agency","healing fantasy attachment","compassion fatigue masked as devotion",
  "self-neglect legitimized by care","emotional janitorialism","premature forgiveness pattern","pardons before impact is processed","attachment through utility","hypervigilant scanning","body constantly studies for danger","freeze-dominant coping",
  "shuts down rather than confronts","fawn adaptation","appeases threat to preserve safety","fight activation style","mobilizes force quickly under threat","flight organization","energy drops out under overwhelm","body-based mistrust",
  "calm in the body feels suspicious","startle retention","system remains easy to jolt","safety nonconsolidation","threat carryover","present read through past danger","body reacts before reasoning catches up","trauma time collapse",
  "old danger feels current","attachment-triggered dysregulation","closeness activates survival states","dissociative glide","mind exits before body does","state-dependent memory","predictability craving","routine sought to limit overwhelm",
  "control as autonomic strategy","power used to settle physiology","exhausted vigilance","numbed aliveness","reduced sensation mistaken for peace","relational threat coding","bracing as baseline","body lives prepared for impact",
  "delayed discharge","reaction arrives after the event","self-trust erosion by trauma","trauma-linked shame","felt safety illiteracy","panic by tenderness","overreading microshifts","tiny changes treated like warnings",
  "recovery guilt","stillness intolerance","organismic distrust","body treated as unreliable narrator","social shape-shifting","status triangulation","suppresses self to preserve inclusion","peripheral self-positioning",
  "social preemption","rejects before being excluded","clique sensitivity","popularity distrust","admiration feels unstable or strategic","audience splitting","performative belonging","appears included feels unseen",
  "relational opportunism","crowd-dependent boldness","social exhaustion masking","appears fine depletes rapidly after","assimilation reflex","merges with dominant tone","outsider fixation","identity fed by not-belonging",
  "approval harvesting","collects positive reactions as fuel","prestige mimicry","belonging vigilance","monitors signs of rejection constantly","tribally moral mind","ethics bend around group loyalty","social camouflage sophistication",
  "relational scarcity bias","performance-in-public collapse-in-private split","social competence masks depletion","invisible competition stance","validation-gathering behavior","curates moments for esteem extraction","alienation imprint","social overreading",
  "belonging grief","urgency field","treats life like time is always running out","frozen becoming","countdown psychology","lives toward anticipated rupture","past-possession pattern","old events dominate present meaning",
  "future siege mentality","tomorrow felt as incoming burden","process intolerance","wants result without developmental middle","repetition compulsion","nostalgic imprisonment","hope deferral","temporal dysregulation",
  "inner timing mismatched to reality","all-or-later mentality","delayed adulthood grief","mourns lost time struggles to re-enter development","premature urgency identity","feels behind and overcompensates","suspended decision-making","mythic future dependency",
  "temporal avoidance","moment noninhabitation","future panic planning","memory-selective identity","curates recall to support self-story","developmental shame","latent becoming","ritualized delay",
  "turns waiting into a lifestyle","crisis-paced living","only knows how to move in emergency time","restless unfinishedness","patience deficit","slowness mistaken for failure","overripe hesitation","waits past readiness",
  "haunted timing","sacred pacing in emergence","situational integrity","conscience-led behavior","image-led morality","selective accountability","self-exempting principle use","moral absolutism",
  "compassion without boundaries","ethics detached from self-protection","principled but unintegrated","believes well behaves inconsistently","conscience bypass","rationalizes what once felt wrong","ethical fatigue","performative conscience",
  "speaks morality without cost-bearing follow-through","private ethics erosion","behaves differently away from witnesses","remorse capacity intact","can feel and metabolize impact","remorse deficiency","consequence understood cognitively not affectively","moves toward repair without coercion",
  "self-purifying guilt","integrity split","public values not matched privately","justice fixation with blind spots","sees others violations misses own","rule dependence","mercy deficit","selective tenderness",
  "empathy depends on identification","moral injury residue","principled resistance","can stand alone under pressure","ethical opportunism","truth loyalty","harmony-over-truth bias","suppresses reality to preserve peace",
  "ethical maturation in progress","learning accountability with complexity","desire inhibition","wants deeply asks weakly","forbidden-want pattern","ambition shame","desire displacement","craving without permission",
  "need shame","basic wanting feels embarrassing","appetitive confusion","intensity addiction","struggles to receive without guilt","pleasure sabotage","interrupts enjoyment before it settles","aimlessness masking fear",
  "desire by opposition","acquisitive soothing","accumulates to fill psychic lack","unchosen life drift","appetite buried under adaptation","motivational fragmentation","many wants no hierarchy","self-disqualifying aspiration",
  "desire present self deemed unfit","eroticization of impossibility","consumption as anesthesia","appetite used to dull affect","starvation idealization","mistakes deprivation for purity","wanting without organizing","desire not translated into structure",
  "reward mistrust","pleasure as threat to control","good feeling seems dangerous","ascetic compensation","greed as emptiness management","longing identity","drive collapse after attainment","quest energizes more than having",
  "purpose hunger","intellectualization","rationalization","retrofits reasons onto driven behavior","projection","locates disowned material in others","reaction formation","displacement",
  "dissociation","exits presence to reduce overwhelm","denial","minimization","shrinks scale to reduce consequence","idealization","devaluation","humor as defense",
  "turns pain sideways into wit","sarcasm armor","protects vulnerability through edge","fantasy compensation","lives partly in imagined resolution","regression","undoing","splitting",
  "cannot hold mixed qualities together","identification with aggressor","sublimation","anticipatory defense","counterphobic posturing","obsessive control defense","overorganizes to prevent affect spill","moralization",
  "converts discomfort into principle","aestheticization","pseudoacceptance","calls resignation peace","insight without surrender","understands defense still serves it","defense fatigue","jaw-held anger",
  "tension stored where words stop","chest-collapse shame","body caves under self-condemnation","forward-leaning vigilance","startle carriage","body posture carries history","shallow-breath control","restricts breath to restrict feeling",
  "frozen facial affect","expression minimized to preserve safety","busy hands braced body","activation searching for discharge","hard gaze defense","eyes used to repel closeness","soft eyes guarded torso split","warmth present body unconvinced",
  "voice constriction under truth","collapse in spine under authority","body remembers hierarchy as danger","restless pacing mind","movement tries to manage overflow","stillness as freeze not peace","oversmiling compensation","face performs ease body does not feel",
  "minimal appetite under stress","survival state suppresses hunger","body recruits external anchors","tremor after composure","discharge arrives once performance ends","numb body loud mind","cognition compensates for disembodiment","protective shrinking",
  "body reduces visibility","expansion anxiety","taking up space feels risky","fatigue from vigilance","body taxed by chronic scanning","breath return in safety","destabilizes when care becomes believable","safety itself becomes activating",
  "usefulness substitutes for worth","selection mistaken for value","articulation replaces action","preserves innocence through ambiguity","vagueness protects self-image","reads threat into silence and delay","absence quickly becomes danger","withdrawal used as consequence",
  "performs strength conceals fragility","hardness covering vulnerability","seeks reassurance cannot metabolize it","soothing sought then rejected","craves closeness fears dependence","desire split by threat","turns shame into accusation","exposure becomes suspicion or blame",
  "covert contracts become bitterness","calm love feels unfamiliar","mistakes chaos for aliveness","treats tenderness like exposure","softness read as risk","uses confusion to evade consequence","murkiness becomes strategy","overfunctions to avoid being left",
  "performance used to secure attachment","helplessness protects against failure","feels safest while braced","relaxation feels unsafe","needs admiration to outpace inadequacy","esteem used to outrun shame","self-minimizing to preempt rejection","finds identity in opposition",
  "resistance used for self-definition","loves through service not receptivity","giving replaces receiving","uses silence to force psychic pursuit","absence made into leverage","is chronically preparing for rupture","bond held under threat expectation","anxiety mistaken for knowing",
  "language outruns embodiment","wants absolution more than accountability","relief preferred over repair","organizes life around anticipated disappointment","expectation shaped by future hurt","protects dignity by refusing need","self-protection through nondependence","turns longing into suspicion",
  "desire becomes distrust","pain remains central organizer","experiences boundaries as rejection first","limits interpreted as abandonment","easy goodness feels unreal","needs visibility fears exposure","familiarity wins over growth","peace disrupts identity organization",
  "disorganization rebranded as truth","still confuses familiarity with safety","past threat shapes present perception","insight precedes capacity","reality gaining priority","eroticized distance","eroticized danger","eroticized rejection",
  "wants most what stays withholding","eroticized powerlessness","eroticized control","eroticized being-chosen","eroticized rescue","eroticized instability","chemistry strongest inside volatility","eroticized secrecy",
  "hiddenness heightens charge","eroticized shame","eroticized admiration","eroticized inaccessibility","eroticized idealization","eroticized pursuit","interest drops once reciprocation stabilizes","eroticized conquest",
  "eroticized repair","eroticized submission to certainty","eroticized chaos regulation","eroticized annihilation fantasy","eroticized devotion","eroticized humiliation","eroticized validation","eroticized novelty dependence",
  "newness required to sustain charge","eroticized emotional deprivation","eroticized objectification","eroticized worship","eroticized possession","eroticized grief","eroticized self-forgetting","eroticized being-needed",
  "feels most desired when indispensable","eroticized being-seen","eroticized risk of abandonment","eroticized withholding","power retained through delayed access","eroticized emotional asymmetry","eroticized danger-to-softness sequence","eroticized attention capture",
  "eroticized dominance as anti-shame","control covers vulnerability","eroticized yielding as relief","eroticized emotional transgression","wants what violates conscious self-image","eroticized exclusivity","eroticized fusion fantasy","eroticized restraint",
  "eroticized volatility bond","eroticized melancholy","eroticized performance anxiety","eroticized invisibility relief","eroticized maternal hunger","eroticized paternal hunger","eroticized punishment","eroticized admiration harvesting",
  "eroticized self-abandonment","eroticized scarcity loop","eroticized degradation-repair cycle","eroticized audience effect","eroticized secrecy container","eroticized forbidden self","reciprocity reduces erotic tension","desirability mistaken for worth",
  "uses seduction to regulate worth","erotic pull becomes self-esteem management","fusion compensates for weak self-cohesion","aroused by what withholds","scarcity intensifies desire","needs admiration to access desire","being adored unlocks erotic charge","most activated by uncertainty",
  "ambiguity heightens charge","calm feels flatter than pursuit","arousal covers sorrow","turns longing into chemistry","ache gets sexualized","mistakes intensity for compatibility","charge mistaken for fit","protects heart by eroticizing distance",
  "exclusivity organizes desire","reverence excites steadiness challenges","direct fabrication","selective omission","curated truth-telling","semantic evasion","hides behind technically correct wording","plausible misunderstanding",
  "false precision","adds detail to simulate honesty","confabulatory smoothing","strategic vagueness","half-confession pattern","retroactive reframing","intentionality minimization","memory opportunism",
  "remembers selectively according to pressure","affective misdirection","moral deflection","question-answer slippage","answers a nearby question not the actual one","overexplained innocence","underexplained concealment","charm-assisted untruth",
  "warmth used to lower scrutiny","indignation defense","acts offended to reverse pressure","false transparency theater","proxy truthing","controlled disclosure","relational truth rationing","image-sparing distortion",
  "benevolent deceit posture","victim repositioning lie-style","exhaustion-based evasion","contradiction normalization","technical innocence dependence","false forgetting","defensive irrelevance flooding","incremental revelation",
  "reactive honesty only","identity-protective deceit","future-faking as deception","motive denial reflex","soft-gaslighting style","tone-substitution defense","benignity inflation","elastic accountability",
  "confession without correction","admits but changes nothing structurally","truth delayed past usefulness","sincerity mimicry","sounds authentic without embodied congruence","borrowed language honesty","accuracy avoidance by abstraction","stays conceptual to avoid specifics",
  "deniability preservation instinct","always leaves an exit route","self-deceiving narrative repair","protective splitting of truth","keeps incompatible realities separated","virtue-shield deception","high-verbal concealment","uses language itself as smoke",
  "shame-driven lying","predatory lying","protects image through selective truth","preserves appearance over accuracy","omission carries the deception","uses detail to fake credibility","precision simulates honesty","answers around the question",
  "evasion replaces direct answer","confesses only after options narrow","truth comes when control shrinks","needs innocence more than accuracy","blamelessness outranks truth","edits narrative under pressure","story changes when exposed","uses offense to avoid disclosure",
  "indignation blocks inquiry","murk protects motive","self-deception stabilizes the lie","promises later to escape now","future talk avoids present consequence","honesty is reactive not principled","always preserves deniability","overstillness under threat",
  "body freezes to contain overwhelm","excessive animation compensation","movement increases to outrun discomfort","eye-contact volatility","hard stare defense","soft-face tense-body split","jaw locking","anger or restraint held somatically",
  "lip compression","mouth asymmetry contempt trace","chin lift defensiveness","shoulder rise vigilance","body prepared for impact","collapsed sternum shame posture","chest caves as self-protection","protective torso angling",
  "body turns partially away under discomfort","body points toward preferred exit or interest","hands hidden under pressure","visible expression reduces when threatened","neck touching self-soothing","contact used to regulate vulnerability","face touching under scrutiny","stress signal not automatic deceit",
  "breath restriction","holds breath to hold affect","speech-breath mismatch","talks while physiologically braced","frozen smile","social signal present joy absent","overbright smile compensation","charm placed over strain",
  "mind checks safety before answering","rapid nodding appeasement","body works to maintain a nonthreatening field","head tilt attunement bid","invites softness or connection","head retraction aversion","self-containment posture","limbs stay close reduced expansion",
  "restless leg discharge","energy searching for outlet","pacing under affect","movement used to metabolize activation","stillness as dominance","motionlessness creates power or opacity","overleaning intensity","divided attention under insecurity",
  "object fidget reliance","voice drop under truth","authentic material deepens or slows the voice","voice brightening under concealment","performative lightness covers tension","sudden flattening of face","shutdown or dissociation entering","blink-rate changes under strain",
  "eye rhythm shifts with arousal","delayed laughter","uneven smile-to-eye congruence","tension smile after conflict","peacekeeping expression over unresolved activation","protective crossing of limbs","body closes for containment or defense","hand wringing or finger picking",
  "self-soothing under anxiety","torso openness with foot withdrawal","body goes small when needs emerge","desire linked with exposure","body goes rigid in tenderness","softness not yet fully safe","postural inflation after shame","microsigh after answer",
  "body releases what words concealed","delayed slump after performance","composure held until safety returns","overlaughing at small remarks","affiliative strategy under uncertainty","still eyes active mouth split","head down eyes up dynamic","deference mixed with vigilance",
  "strong handshake collapsed shoulders split","curated confidence over depleted base","feet planted gaze fragmented","body wants steadiness mind remains unsettled","body braces before words do","physiology reacts ahead of speech","warm face guarded torso","expression welcomes body stays defended",
  "needs to look calm more than feel calm","appearance prioritized over regulation","anger lives in the jaw","tension holds unsaid aggression","softness rises body resists it","wants contact keeps an exit","uses stillness to regain power","motionlessness becomes control",
  "performs ease over activation","composure covers arousal","contraction replaces assertion","eyes ask posture retreats","leaves the body before leaving the room","dissociation precedes exit","body says no faster than mouth does","physiology refuses before language does",
  "physiology contradicts narrative","body cues conflict with stated story","calms only after control returns","regulation depends on restored dominance","still smiling no longer open","past threat lives in stance","spiritualized avoidance","premature forgiveness posture",
  "love-and-light defense","positivity exiles darker truth","karmic rationalization","destiny laundering","lesson inflation","vibration superiority","ascension narcissism","energetic blame-shifting",
  "intuition-infallibility posture","spiritual grandiosity","special mission identity covering inadequacy","guru hunger","channeling authority dependence","hex paranoia drift","ordinary conflict becomes magical persecution","shadow-work romanticization",
  "wound-as-gift inflation","cosmic exceptionalism","embodiment avoidance via theory","talks energy avoids body","esoteric compensation","nondual bypass","forgiveness coercion","sacralized confusion",
  "aesthetic spirituality","curates sacred image without groundedness","prayer-as-avoidance","ceremonial displacement","purity obsession in sacred clothing","discernment collapse into projection","personal fear labeled spiritual download","chosen-one exhaustion",
  "specialness fantasy becomes burden identity","oracular overconfidence","impressions trusted beyond adequate testing","frequency moralism","alchemical language without actual metabolization","ancestral language as shield","trauma mystification","ceremonial control",
  "divine timing passivity","compassion bypass","shadow inflation","sacred exceptional suffering","energetic boundary fantasy","detachment distortion","emotional withdrawal called enlightenment","intuition contaminated by wish",
  "deepest desire disguised as message","mystical certainty against evidence","inner revelation outranks clear reality","sacred identity fragility","worldview challenge felt as desecration","frequency policing","disagreement dismissed as misalignment","spiritualized non-accountability",
  "devotional self-erasure","mistakes self-loss for surrender","sacred rescue fantasy","believes love or light alone will redeem what needs boundary and consequence","channel-versus-check split","trusts downloads more than outcomes","esoteric dependency","numinous overinterpretation",
  "significance detected everywhere discernment lagging","uses transcendence to avoid contact","spirituality replaces embodied encounter","meaning outruns mourning","needs mystery more than accuracy","obscurity preferred over grounded truth","mistakes projection for intuition","calls withdrawal detachment",
  "distance renamed enlightenment","inflates wounds into spiritual rank","suffering becomes prestige","symbolism substitutes for authorship","spiritual vocabulary covers concrete issues","treats forgiveness like erasure","absolution bypasses impact","feels chosen when feeling powerless",
  "specialness compensates for helplessness","metaphysics outruns mourning","needs higher narrative to hold shame","grand frame contains defectiveness","romanticizes shadow resists accountability","darkness embraced more than integrated","trusts symbolism faster than evidence","signs outrun facts",
  "speaks energy avoids behavior","abstraction replaces action","mysticism substitutes for limit-setting","seductive helplessness","relational sorcery pattern","beauty-as-power dependence","soft control","eroticized self-objectification",
  "wombed resentment","maternal engulfment","attachment through suffering","mirror hunger","receiver entitlement","weaponized tenderness","vulnerability used to disarm accountability","jealous enchantment",
  "indirect rivalry","priestess inflation","mystique dependence","opacity cultivated to preserve allure","emotional weather control","room organized around personal state without direct request","devotional extraction","invites loyalty while offering ambiguity",
  "victim-queen duality","receptivity as test","lunar volatility","erotic withholding as power","sororal betrayal wound","nurturance without boundaries","overmothers then resents depletion","sacred feminine inflation",
  "honeyed contempt","sweetness carrying quiet diminishment","beauty grief","selection obsession","intensity-as-depth belief","rejection alchemy into glamour","dark feminine compensation","weaponized unreadability",
  "need denial through allure","feral tenderness split","softness present trust absent","mother wound reenactment","self-erasure through devotion","hyperreceptive boundarylessness","primal desirability anxiety","sorrow-glamor fusion",
  "pain woven into beauty identity","receives attention distrusts its sincerity","admiration does not fully land","competes by indirection not declaration","rivalry stays covert","needs to feel unforgettable","memorability organizes worth","tenderness used instead of clarity",
  "turns hurt into atmosphere","wants devotion without clear terms","loyalty desired without explicit agreement","attraction confused with emotional safety","protects need with mystery","opacity covers dependency","indirectness replaces direct request","uses unreadability as power",
  "ambiguity sustains influence","feels chosen or erased","selection determines selfhood","soft outside armed inside","gentleness covers defense","buries anger beneath grace","resentment hidden under composure","makes beauty carry self-worth it cannot safely hold",
  "desirability overloaded with identity needs","armored competency","power-seeking covers inner helplessness","emotional austerity","tenderness shame","protector inflation","provider identity collapse","self-worth crashes when materially ineffective",
  "instrumental relating","control through certainty","speaks definitively to avoid vulnerability","authority addiction","needs respect to regulate selfhood","rage as permitted sadness","possession-coded love","stoic dissociation",
  "humiliation intolerance","performance masculinity","dominant posture dependent core split","acts autonomous while inwardly attachment-hungry","rescue entitlement","sex-as-worth regulation","desirability or conquest stabilizes self-esteem","emotional illiteracy with moral pride",
  "competence tyranny","injury-to-control conversion","pain answered with tightened command","mentorship inflation","enjoys instructing more than mutuality","withholding as sovereignty","distance mistaken for power","conflict as hierarchy",
  "vulnerability bargaining","savior complex with resentment","gives then feels used","father wound reenactment","shame masked by swagger","bravado protects defectiveness","displaced animus","projects disowned aggression onto others",
  "initiation deficit compensation","intimacy incompetence hidden by charisma","social fluency exceeds relational depth","mission over mutuality","goals outrank emotional responsibility","need disdain","collapse after failure","predatory calm",
  "tenderness panic","provider martyrdom","confidence covers vulnerability","softness feels dangerous","numb control mistaken for wholeness","dignity precedes softness","becomes useful instead of vulnerable","confuses leadership with domination",
  "guidance collapses into control","calls distance strength","withdrawal framed as power","turns shame into hardness","humiliation converted into rigidity","asks for little resents much","strength identity blocks rest","provision substitutes for intimacy",
  "protects weakness by mocking it","contempt guards vulnerability","handles crisis better than closeness","emergency feels safer than intimacy","invulnerability equated with safety","cagey disclosure","confessional luring","hidden motive",
  "controlled revelation","privacy as self preservation","partial honesty","delayed honesty","disclosure anxiety","revelation compulsion","open quickly then panic","chronic guardedness",
  "curated weakness","emotional flooding after disclosure","only vulnerable when advantaged","delayed truth after resentment","silence under scrutiny","confesses in crisis","black sheep role","role inversion",
  "rescuer becomes controller","victim becomes aggressor","peacemaker becomes saboteur","helper becomes resentful punisher","strong one collapses helplessly","avoidant becomes pursuer under threat","pursuer becomes cold withdrawer","innocent persona flips accusatory",
  "stoic persona flips explosive","nurturer flips engulfing","nihilistic lean","responsibility oriented stance","avoidance of freedom","dread of purposelessness","chosen one worldview","absurdist contact",
  "cosmic belonging","exile consciousness","existential apologetics","reality interpretation","evidence based reading","threat based reading","symbolic reading","persecutory reading",
  "scarcity reading","moralized reading","romanticized reading","cynical reading","sacred reading","trauma filtered reading","self referential reading","control framed interpretation",
  "possibility framed interpretation","nostalgia pull","all or later mentality","crisis paced time","sacred pacing","temporal detachment","memory weighted identity","anticipation states",
  "dread","vigilance","hope","preemptive grief","rescue fantasy","catastrophe rehearsal","disappointment expectation","reunion fantasy",
  "bracing","scanning","impulsive preparation","certainty seeking","relief fantasy","anticipatory suffering","hyperplanning","grief states",
  "frozen grief","ambient grief","displaced mourning","compartmentalized bereavement","stoic grief posture","anger coated grief","belated grieving","identity grief",
  "unmourned future","phantom attachment","grief guilt","invisible grief","anticipatory grief","devotional bereavement","body kept sorrow","unfinished goodbye",
  "survivor shame","desire architecture","forbidden want","deprivation hunger","eroticized scarcity","attachment to longing","eroticized being chosen","self abandoning desire",
  "personal identity","rigid self concept","overidentification with role","label dependence","unstable self definition","weak core continuity","ego dissolution","softened self boundaries",
  "diminished separateness","unity seeking","loss of fixed i","anonymity seeking","desire to go unseen","erase footprint","avoid recognition","retreat from personhood",
  "depersonalization traits","self unreality","estranged from own thoughts and body","no stable social function","detachment from titles","existential drift","non positional selfhood","behavior patterns",
  "repetitive coping loops","predictable reactions","entrenched habits","patterned responding","anticipatory appeasement","conflict minimizing","chronic self adjustment","avoidance patterning",
  "delay","disappearance","deferral","emotional ducking","pre emptive defense","compulsive clarification","fear of misreading","rigidity",
  "intolerance of uncertainty","compensatory micromanagement","spontaneity","impulse led action","low premeditation","present driven responding","unpredictability","inconsistent follow through",
  "abrupt pivots","unstable behavioral continuity","sudden cutoffs","sharp reversals","impulsive exits","self sabotaging breaks","improvisational style","adaptive",
  "intuitive","makes structure in motion","functional chaos","masked hostility","indirect aggression","lying by omission","selective truth","strategic silence",
  "informational control","triangulation","third party insertion","emotional leverage through outsiders","narrative splitting","covert testing","engineered scenarios","baiting for reaction",
  "disguised accusation","passive sabotage","subtle obstruction","hidden undermining","quiet noncooperation","false innocence","rehearsed confusion","performative naivety",
  "evasion under scrutiny","narrative revisionism","moving goalposts","self exonerating retellings","transparency","direct disclosure","low concealment","observable motive",
  "integrity","value behavior alignment","ethical consistency","open accountability","admits fault","names impact","low defensiveness","relational dynamics",
  "attachment driven relating","bond insecurity","fear based reciprocity","anxious pursuit","abandonment sensitivity","hyper attunement to distance","avoidant distancing","emotional withholding",
  "intimacy resistance","push pull cycle","alternating pursuit and withdrawal","unstable closeness tolerance","enmeshment","blurred separateness","overinvolvement","identity fusion",
  "dependency pattern","overreliance","diminished autonomy","externalized stability","control dynamic","monitoring","possessiveness","detachment",
  "emotional uncoupling","guardedness","relational de investment","individuation","stable separateness","selfhood retained in closeness","non entanglement","connected but bounded",
  "low fusion","differentiated intimacy","restoration through aloneness","low social dependence","archetypal positions","savior complex","rescue identity","worth through fixing others",
  "martyr pattern","self sacrifice","grievance accumulation","unseen suffering identity","victim stance","powerlessness identity","injury centered meaning","external locus",
  "oppositional self definition","anti authority reflex","orphan pattern","belonging deficit","rejection sensitivity","attachment wound identity","healer role","emotional labor identity",
  "repair driven relating","scapegoat position","blame absorption","destroyer pattern","destabilizing force","rupture as power","symbolic perception","nonordinary meaning making",
  "role refusal","anti categorization","symbolic resistance","fluid identity","shifts masks readily","context based selfhood","nonfixed persona","ambiguity",
  "hard to read motives","mixed symbolic signals","unclassifiable style","resists pattern assignment","low archetypal stability","somatic states","vigilant body posture","sympathetic arousal",
  "restless","keyed up","shallow breath","freeze pattern","immobility","collapse under stress","flattening","reduced responsiveness",
  "armoring","muscular guarding","jaw tension","chest restriction","defensive posture","dysregulation","swings between activation and collapse","disembodiment",
  "head dominant functioning","low body awareness","sensation avoidance","numbness","psychic abstraction","overintellectualization","symbolic displacement","thought over feeling",
  "dissociative tendencies","fragmented embodiment","groundedness","affect linked to sensation","present state access","felt time","dread stretched temporality","time drags under distress",
  "urgency distortion","compressed time sense","panic driven speed","pressure saturation","suspended time","waiting state consciousness","stalled momentum","frozen progression",
  "past saturated present","timeless flow","immersion state","loss of clock awareness","full absorption","schedule dependence","external structuring","measured living",
  "clock time dominance","punctuality fixation","quantitative time tracking","chronological framing","linear sequencing","event order emphasis","narrative time coherence","weak connection to calendar reality",
  "drifting timeline sense","outside of time feeling","perception","threat scanning","overreading cues","anticipatory suspicion","projection prone","attributes inner material outward",
  "discernment intact","reads pattern accurately","signal noise separation preserved","symbolic over attribution","meaning saturation","excessive pattern linkage","paranoia leaning","covert threat assumptions",
  "guilt sensitive","self blaming","reparative drive","shame organized","self condemning","identity level defectiveness","concealment urge","rationalization heavy",
  "self excusing cognition","self righteousness","superiority posture","judgment inflation","accountability deficits","values enacted consistently","communication style","direct",
  "plain spoken","low ambiguity","message congruent","evasive","circling","answer avoidant","deflective","topic shifting",
  "discomfort redirection","passive aggressive","indirect hostility","deniable contempt","mixed signal delivery","anxious elaboration","pre emptive justification","combative defensiveness",
  "disagreement sensitivity","perceived attack bias","seductive language patterning","affective persuasion","charm as influence strategy","intimidating speech","volume escalation","dominance signaling",
  "coercive tone","boundary structure","overaccess granted","low self protection","suggestibility to others needs","defensive distance","low permeability","intimacy restriction",
  "fluctuating limits","situational overexposure and withdrawal","healthy boundarying","clear limits","stable access control","differentiated self other line","intrusive questioning","emotional overreach",
  "entitlement to access","secrecy reliance","guarded disclosures","concealment as safety","motivational force","fear driven","avoidance led","safety over growth",
  "longing driven","attachment seeking","unmet need pursuit","control driven","revenge tinged","injury retention","punitive fantasy","grievance fueled action",
  "vanity led","image curation","status sensitivity","curiosity driven","novelty seeking","exploratory cognition","short horizon thinking","crisis based decision structure",
  "meaning hunger","self relation","self trusting","internally anchored","coherent inner alliance","self betrayal pattern","overrides own knowing","chronic self abandonment",
  "self punitive","harsh inner authority","deprivation logic","no mercy internally","self forgiving","repair oriented","non annihilating self reflection","inner conflict saturation",
  "competing selves","unstable self loyalty","self possession","reality contact","grounded","reality based","evidence responsive","denial based filtering",
  "excludes unwanted reality","affect protective distortion","fantasy dependence","retreat into imagined resolution","low action conversion","magical thinking","symbolic causality inflation","meaning action confusion",
  "dissociative reality thinning","weak present anchoring","outsider identification","edge of group stance","submission pattern","deference","conflict avoidant lowering","invisibility adaptation",
  "self erasure for safety","worth tied to impression management","belonging hunger","strong group acceptance drive","narrative stance","survivor identity","adversity integrated self concept","endurance based meaning",
  "perpetual victim narrative","repeated injury framing","low agency tone","misunderstood self schema","chronic misrecognition theme","loneliness in perception","redeemer fantasy","salvation through love script",
  "transformational self mission","exile narrative","outsider destiny","severed from home identity","phoenix framing","destruction rebirth cycle","reinvention identity","cursed self concept",
  "repeated doom expectancy","fate colored interpretation","witness position","observer identity","recorder not participant","collapse bringer self image","unconscious ending maker","identity formation",
  "self assembly","role consolidation","ego structuring","internal continuity","self concept stabilization","borrowed persona","adaptive masking","role confusion",
  "unstable self authorship","fractured self image","self-concept","stable self regard","fragile self regard","inflated self regard","shame based self view","identity diffusion",
  "overidentified competence","victim anchored identity","martyr anchored identity","rebel self definition","rescuer self definition","approval built self","borrowed selfhood","role fused identity",
  "self minimizing habit","counterfeit certainty","core shame identity","fragile self cohesion","self possession in emergence","self-image","image based selfhood","aestheticized self-construction",
  "polished exterior fragile interior","public self private depletion split","body based worth","competence based worth","moral self image","damaged self image","invisible self image","specialness fantasy",
  "undesirable self image","chosen self image","idealized self image","self disgust","reputation fixation","mirror fed identity","persona construction","compensatory persona",
  "false maturity posture","hyper competent persona","seductive persona","mystic persona","helper persona","strong one persona","innocent persona","misunderstood persona",
  "intellectual persona","stoic persona","wild persona","dark feminine persona","holy rebel persona","wounded healer persona","overadapted persona","strategic softness persona",
  "impression management","image custodianship","reputational editing","controlled vulnerability","strategic disclosure","charm deployment","social camouflage","concealment of motive",
  "prestige signaling","competence signaling","softness signaling","spiritual image management","selective confession","technical innocence","performance based belonging","moral alignment",
  "ethical congruence","image led morality","conscience led behavior","self exempting principle use","harmony over truth bias","moral rigidity","moral opportunism","self purifying guilt",
  "value hierarchies","safety over truth","loyalty over honesty","peace over confrontation","status over intimacy","belonging over authenticity","image over integrity","control over mutuality",
  "admiration over humility","freedom over responsibility","certainty over complexity","devotion over dignity","power over tenderness","survival over growth","harmony over accountability","pleasure over discipline",
  "meaning over evidence","self protection over transparency","motivation structures","fear driven action","avoidance led behavior","longing driven behavior","revenge tinged motive","admiration seeking",
  "hunger for union","predictability hunger","scarcity based motive","survival mode","status pursuit","curiosity drive","sensation hunger","control seeking",
  "shame avoidance","guilt reduction","transcendence seeking","escape from self drive","avoidance","people pleasing","overexplaining","appeasement",
  "numbing","humor","sarcasm","working harder","cleaning to regulate","disappearing","sleeping to escape","self soothing through ritual",
  "fantasy retreat","hyperindependence","micromanagement","emotional shutdown","crisis mobilization","isolation","compulsive talking","reassurance seeking",
  "scrolling","substance use","hostility masked as calm","confusion as defense","attachment styles","anxious attachment","avoidant attachment","fearful avoidant attachment",
  "disorganized attachment","secure attachment","ambivalent attachment","protest behavior","pursuit withdrawal cycle","reassurance hunger","deactivation","hyperactivation",
  "preemptive abandonment","intimacy intolerance","fusion hunger","hyperindependence as defense","wounded loyalty","jealous vigilance","attachment surveillance","trust starvation",
  "sentinel in intimacy","attachment through crisis","triangle dependence","earned closeness incapacity","boundary patterns","porous boundaries","rigid boundaries","inconsistent boundaries",
  "collapsed boundaries","overguarded boundaries","guilt bound limits","overdisclosure","secrecy as safety","intrusion tolerance","self negotiating against instincts","direct speech",
  "evasive speech","circling speech","passive aggressive delivery","defensive verbosity","semantic evasiveness","ambiguous phrasing","concern coded criticism","sweetened contempt",
  "moralizing speech","monologic relating","non answer compliance","narrative flooding","charm based deflection","pseudo vulnerability","confession theater","interrogative selfhood",
  "silence as leverage","conflict style","counterattack","delayed eruption","scorched earth reaction","micro retaliation","scorekeeping","post conflict amnesia",
  "compelled clarification","moral inversion","anti authority stance","submission as safety","covert domination","soft domination","power avoidance","rank sensitivity",
  "helplessness as control","moral high ground domination","territoriality","dominance and submission patterns","coercive certainty","withhold to control","charm based authority","appeasing deference",
  "fearful compliance","pseudo submission tactic","dominance through stillness","loyalty extraction","shame based yielding","covert one upmanship","trust calibration","immediate trust",
  "guarded trust","slow earned trust","hypervigilant mistrust","betrayal expectancy","selective trust","trust based on usefulness","trust based on consistency","trust collapse after rupture",
  "reassurance invalidation","testing before trusting","trust through intensity","trust through time","epistemic mistrust","catastrophic object constancy weakness","collapse","rage",
  "defensiveness","superiority","withdrawal","hiding","overachievement","perfectionism","false modesty","self deprecation",
  "self reproach","shame fueled generosity","shame fueled service","shame fueled silence","shame fueled lying","shame fueled attack","projection patterns","motive misassignment",
  "hostile attribution","jealousy projection","guilt projection","infidelity projection","aggression projection","weakness projection","envy projection","betrayal projection",
  "disowned desire projected outward","shadow projection","fear labeled intuition","contamination projection","spiritualized projection","projective enactment","mirrored shame","mirrored grandiosity",
  "cognitive distortions","black and white thinking","mind reading","personalization","overgeneralization","emotional reasoning","confirmation bias","hostile attribution bias",
  "negative filtering","hope disqualifying cognition","premature closure","self referential filtering","dissociation states","depersonalization","derealization","observer state",
  "absent presence","dreamlike functioning","time loss","emotional numbing","body detachment","faraway gaze","freeze dissociation","overfunctioning while disconnected",
  "post conflict blankness","memory gaps","shutdown","soft dissociative glide","compartmentalized self states","unreality tone","nervous system regulation","grounded regulation",
  "hyperarousal","hypoarousal","freeze","fight activation","flight activation","dysregulation swings","bracing baseline","co regulation dependence",
  "interoception","body awareness intact","weak body reading","delayed hunger recognition","delayed fatigue recognition","confused anxiety and intuition","numb sensation tracking","poor emotional labeling through body",
  "strong visceral knowing","shallow breath unawareness","tension blindness","somatic alarm recognition","body mistrust","proprioceptive underreading","trauma imprints","hypervigilance",
  "abandonment anticipation","shame by exposure","control as safety","appeasement reflex","freeze dominant coping","attachment triggered dysregulation","domestic hypervigilance","self trust erosion",
  "old danger in new rooms","survival mode bonding","panic in tenderness","memory patterning","selective recall","hypermnesic wound retention","memory embalming","traumatic intrusion",
  "narrative revision","state dependent memory","emotional chronology bias","anniversary activation","confabulatory repair","unfinished goodbye replay","memory as identity scaffold","grief by substitution",
  "role based remembering","memory gaps under stress","symbolic thinking","pattern linking","synchronicity reading","metaphorizing events","archetypal overlay","sacred projection",
  "emblematic thinking","omen reading","ritual meaning assignment","dream coding","fate framing","allegorical identity","symbolic concretization","meaning-making",
  "survival narrative","redemption narrative","victim narrative","phoenix narrative","karmic framing","lesson framing","mythic self story","existential meaning search",
  "suffering as purpose","teleological defense","spiritualized conflict","symbolic compensation","meaning monopolization","biography as defense","destiny language","ritualized behavior",
  "compulsive checking","repeated apology","cleansing rituals","bedtime control rituals","sobriety routines","relapse ritual sequences","grief rituals","nervous fidget sequences",
  "object anchors","overpreparation routines","beauty rituals for control","prayer loops","pacing loops","restart rituals","outsider stance","insider performance",
  "appeasing subordinate stance","dominance stance","invisible observer stance","social climbing","edge of group positioning","alienation expectancy","validation gathering","low visibility strategy",
  "strategic affiliation","peripheral self positioning","group identity","tribe belonging","oppositional identity","clique attachment","family role identity","subculture identity",
  "martyr group role","scapegoat identity","chosen outsider identity","moral in-group loyalty","spiritual community identity","rebel belonging","secret-knowledge belonging","performance belonging",
  "loyalty through shared grievance","loyalty structures","family loyalty over truth","trauma bond loyalty","devotion to harmful authority","loyalty through sacrifice","burden based belonging","secrecy based loyalty",
  "reciprocity based loyalty","hierarchy based loyalty","identity through allegiance","tribe before ethics","repair through allegiance","betrayal paranoia","obligation without nourishment","taboo navigation",
  "thrill seeking around forbidden material","moral splitting","secret indulgence","repression of desire","fascination with transgression","eroticized taboo","purity obsession","hidden vice compartmentalization",
  "secrecy around appetite","social mask over forbidden fantasy","moral loopholing","deviance glamourization","secrecy and disclosure","compulsive secrecy","strategic opacity","coherence seeking",
  "self definition through contrast","perception and interpretation","meaning assignment","signal sorting","motive inference","contextual reading","overinterpretation","selective attention",
  "pattern imposition","cue sensitivity","ambiguity intolerance","interpretive rigidity","embodiment","bodily self awareness","sensory grounding","somatic presence",
  "instinct access","body trust","numbed sensation","bodily alienation","muscular armoring","tension holding","visceral knowing","felt sense disruption",
  "social strategy","alliance building","status calibration","self positioning","tactical agreeableness","audience adaptation","relational maneuvering","power and hierarchy",
  "submission cues","authority testing","deference patterns","status vigilance","territorial behavior","command tone","hierarchy navigation","prestige attachment",
  "coercive positioning","subordination memory","relational asymmetry","attachment and belonging","proximity seeking","inclusion hunger","attachment protest","reassurance dependence",
  "bondedness","relational anchoring","exile fear","belonging through compliance","emotional dependency","affiliative drive","rejection vigilance","attachment instability",
  "concealment and revelation","self protection through secrecy","partial exposure","concealed shame","masked intent","privacy boundarying","covert signaling","rupture and repair",
  "relational fracture","trust break","emotional fallout","confrontation avoidance","repair attempt","accountability offering","reenactment cycle","apology deficit",
  "reconnection bid","defensive retreat","unresolved injury","restoration effort","repeated rupture pattern","morality and transgression","ethical boundary testing","taboo crossing",
  "self justification","moral conflict","rule violation","conscience strain","rationalized harm","integrity lapse","forbidden impulse","reparation drive",
  "transgressive thrill","symbolism and myth","metaphorized experience","symbolic substitution","ritual meaning","narrative enchantment","mythic compensation","symbolic inflation",
  "imaginal structuring","meaning through allegory","temporality and memory","past saturation","memory weighting","nonlinear recall","time distortion","anticipatory dread",
  "future preoccupation","emotional chronology","memorial fixation","timeline fragmentation","temporal dislocation","recollective bias","unfinished past","consciousness states",
  "altered state access","trance susceptibility","hyperlucidity","dissociative drift","narrowed consciousness","dreamlike processing","ecstatic absorption","depersonalized witnessing",
  "threshold awareness","state dependent meaning","adaptation and survival","resource conservation","opportunistic adjustment","survival intelligence","self preservation reflex","stress adaptation",
  "camouflage behavior","compromise for safety","environment scanning","resilience under constraint","tactical retreat","desire and aversion","attraction pull","avoidance drive",
  "craving structure","longing intensity","repulsion coding","ambivalent wanting","forbidden desire","refusal patterning","attachment to absence","compulsive pursuit",
  "defensive disinterest","pleasure fear","truth","delusion","and narrative control","reality shaping","story domination","self preserving narrative",
  "perceptual distortion","false coherence","truth avoidance","reality editing","delusional certainty","narrative seizure","counterfactual insistence","story based control",
  "plausibility performance","liminal states","in between identity","threshold instability","transitional selfhood","ambiguity tolerance","suspension phase","unfinished transformation",
  "category refusal","psychic doorway state","not yet formed stance","dissolution before reorganization","uncertain emergence","edge consciousness","threshold holding","psychic economy",
  "emotional expenditure","defensive budgeting","depletion cycle","attachment investment","shame taxation","fantasy as compensation","desire rationing","motivational scarcity",
  "psychic overload","internal resource hoarding","affective spending","conflict cost","symbolic overinvestment","ontological stance","reality assumptions","being in the world",
  "metaphysical posture","skepticism level","faith structure","existential anchoring","certainty need","materialist framing","mystical openness","essence attribution",
  "reality relation style","affective texture","emotional grain","mood coloration","tonal density","irritability baseline","tenderness capacity","dread undertone",
  "melancholic wash","numb flatness","volatility","fragile warmth","cold defensiveness","bittersweet attachment","emotional roughness","affective saturation",
  "behavioral residue","leftover coping pattern","habitual afterimage","repeated reaction trace","trauma imprint in conduct","residual defensiveness","learned posturing","conditioned withdrawal",
  "compulsive repetition","protective reflex","stale adaptation","embodied memory in action","interactional carryover","unresolved pattern leak","post event behavioral echo","intrapsychic conflict",
  "competing drives","self division","ambivalence strain","inner opposition","guilt versus desire","protector versus vulnerable self","fragmentation pressure","contradictory self commands",
  "split loyalties","internal negotiation failure","self sabotage conflict","unresolved psychic tension","divided will","embodied cognition","thought through sensation","bodily reasoning",
  "posture shaped perception","visceral appraisal","cognition tied to physiology","somatic prediction","tension informed judgment","movement based knowing","nervous system framing","body state dependent thought",
  "felt inference","sensory weighted interpretation","cognition under arousal","narrative identity","self story architecture","autobiographical framing","continuity through narrative","chosen meaning line",
  "victim script","survivor script","redeemer script","exile script","self mythologizing","revisionist self telling","identity through remembered plot","psychosocial mirroring",
  "reflected selfhood","social echoing","approval based self recognition","projected role uptake","interpersonal reflection hunger","co created identity","validation dependency","social feedback imprint",
  "reciprocal image making","emotional contagion shaping self sense","shadow material","disowned impulse","repressed hostility","covert envy","hidden need","denied aggression",
  "forbidden fantasy","shame sealed content","projected darkness","split off motive","unconscious contempt","buried appetite","moral self discrepancy","unclaimed vulnerability",
  "concealed destructiveness","threshold consciousness","edge awareness","pre verbal knowing","dawning recognition","near dream cognition","symbolic surfacing","limen sensitivity",
  "unstable but potent awareness","almost conscious material","faint intuitive registration","partial emergence","twilight perception","crossing into insight","mind at the doorway","fantasy for deficiency",
  "image filling absence","exaggerated spiritual meaning","overidentification with symbol","ritualized control","mythic cover for wound","aesthetic compensation","symbolic inflation against powerlessness","substitute meaning structure",
  "inner lack disguised as destiny","emblematic overcorrection","psychic balancing through image","existential dissonance","life meaning fracture","value reality mismatch","spiritual disquiet","ontological unease",
  "alienation from purpose","absurdity contact","being stranded in self awareness","despair under lucidity","emptiness under function","existential split","significance hunger","moral injury",
  "betrayal of conscience","violation by self or authority","ethical shock","guilt scar","shame saturation","trust collapse in the good","soul level offense","desecration feeling",
  "damage to moral identity","spiritual contamination","conscience wound","perceptual framing","lens selection","contextual biasing","foreground background assignment","emotional coloring of input",
  "narrative lensing","assumption guided reading","frame locked interpretation","threat framing","victim framing","sacred framing","cynical framing","scarcity framing",
  "control framing","possibility framing","third party leverage","alliance manipulation","outsider recruitment","emotional proxy warfare","comparison insertion","destabilization through third presence",
  "competitive attachment","covert coalitions","dyadic contamination","triangulated validation seeking","somatic encoding","body stored memory","symptom as message","tension as archive",
  "procedural pain memory","posture based defense","autonomic imprinting","trauma held in musculature","sensation linked meaning","embodied alarm pattern","physicalized conflict","body as mnemonic system",
  "archetypal possession","overidentification with symbolic role","savior takeover","martyr fixation","destroyer dominance","mystic inflation","victim enthrallment","shadow ruled behavior",
  "role trance","myth driven action","ego eclipsed by pattern","compulsive enactment of archetype","symbolic seizure","identity subsumed by psychic image","temporal drag","slowed subjective time",
  "prolonged waiting state","inertial mood field","depressive duration","stuckness in time","heavy sequence flow","delayed psychic processing","inability to transition","emotional time lag",
  "momentum loss","dragged future","elongated suffering","stalled becoming","affective forecasting","predicted emotional outcome","imagined future feeling","dread projection",
  "hope projection","mispredicted satisfaction","anticipated regret","emotional expectation mapping","fear of future affect","craving based forecasting","disappointment rehearsal","mood estimation bias",
  "future self feeling script",
  // ── irreversible moments batch ──
  "no way back from this","already crossed","the return closed","once said it changed","the door sealed","after that nothing held","crossed and kept moving","the break was clean",
  "already on the other side","let it close","said and done","the line moved","stepped over and stayed","past the point of undoing","the version that waited ended","turned and didn't look back",
  "what was done was done","that one couldn't be taken back","the before was gone","sealed it without ceremony","moved and didn't explain","the threshold passed","couldn't unknow it","left that version behind",
  "the shift was permanent","nothing to return to","already somewhere else","the change held","moved past the repairable","the original was gone","broke without breaking down","ended before the ending",
  "the distance became fixed","released and didn't retrieve","stepped outside and stayed","the old arrangement dissolved","past where apology reaches","the habit outlived itself","the pattern ended mid-step","something settled into place",
  "chose and the choice held","what closed didn't reopen","moved before being ready","the turn was complete","already past the asking","let it finish itself","the door was already closed","the known became the former",
  "nothing restored itself","the before and after split","the door didn't budge","gone and didn't look","the break was final","no thread back","past fixing","the old self dropped",
  "no way through","the line held","already past","nothing reclaimed","the cut was clean","closed without sound","the turn stayed turned","no second door",
  "stepped and meant it","the behind disappeared","no retrieval","the cord severed","after no before","the ending took","nothing called","sealed by silence",
  "the past went foreign","no loose ends","crossed without ceremony","the gap fixed itself","no backwards pull","already elsewhere","the stop held fast","no undoing",
  "the shift locked in","the earlier shape dissolved","no reclamation","the gate not guarded just gone","what ended stayed ended","moved and didn't measure","already divided","the threshold disappeared",
  "no reverse","the change absolute","the old story finished","no echo back","the severance quiet","finished without sound","nothing to resume","the prior self unreachable",
  "let it and it held","no path backward","settled into gone","no resurrection","the break laid still","no backtrack","the seam vanished","already something else",
  "no former claim","the distance became distance","locked without key","no unwinding","cut without gesture","and stayed cut","no more return","ended so it was",
  // ── luminous departures batch ──
  "vanished in a puff of glitter","the door was never there","stepped through and became the sky","the key dissolved in the lock","no lock no door no before","the spell was to leave",
  "the room forgot me instantly","already mist","the old name turned to smoke","walked out and the house sighed with relief","the wand snapped on purpose","the cloak dropped mid step",
  "the map burned itself behind me","no breadcrumb trail just moonlight","the threshold winked and let me through","the goodbye turned to birds","the hex was lifted by leaving","already moved into the enchantment",
  "the mirror showed nothing and that was the point","the path closed like water","the departure was the incantation","the former self turned to petals","whispered something and it opened","the leaving was luminous",
  "the exit bloomed","the door appeared when I said nothing","the silence after was golden","already in the other story","the cape swirled and I was elsewhere","the roots let go gladly",
  "the wave was a spell","the old chapter sealed with wax and light","the turning point was stardust","the escape left a constellation","the incantation was silence","the step was the portal",
  "the gate was gossamer","the vanish was velvet and stars","no trail no trace just a shimmer","the old grew transparent then disappeared","the leave was levitation","the key was never metal just a look",
  "the walk was winged","the before folded into a paper crane and flew","the darkness knitted itself shut behind me","already in the glow","the spell was simple walk and mean it","the vanishing act had no audience just awe",
  "the door bowed and disappeared","the release shimmered","the gone was golden","the next chapter opened with light","the mirror cracked with gratitude","the way out was made of breath",
  "the end was a beginning wearing a cape",
  // ── internet native oracle batch ──
  "the old me is restricted","i muted my own lore","the backstory is paywalled","i dont have access to that version anymore","the origin story got boring so i wrote a new one","left my own close friends list",
  "the highlight reel expired","the old chapters are out of print","i archived myself without warning","the username felt heavy so i changed it","the bio used to be a confession now its just empty","no era no aesthetic no explanation",
  "the rebrand was silent and final","the old posts deleted themselves when i did","i stopped being a regular at my own sadness","the bit was tired so i killed it","the character development was cutting everyone off including me","my past self keeps typing",
  "i leave them on read","the lore got too long so i skipped to the end","no callback no reference no revival","the former me has no signal","i left the narrative mid season","the plot needed no closure",
  "the show was cancelled by me","i stopped performing the self","the identity leaked so i drained it","my old tweets sound like a stranger","i dont correct them","the memory folder was corrupted",
  "i deleted it without checking","the vibe was a rental","i moved out","the timeline broke and i stepped over the crack","no recap no summary no moral","the profile is blank and that is the statement",
  "the brand went independent and then dissolved","the past is a podcast i stopped listening to","unpinned the trauma","unhearted the old posts","the persona had a system error","i let it crash",
  "the old life is a screenshot in a deleted chat","the exit interview was with myself","i said nothing helpful","the vibe audit said let it all go","the former voice is on mute and the new one hums","the me that stayed up worrying is asleep now",
  "i stopped checking for updates","the old life stopped loading","i refreshed and it was gone","the goodbye was a terms and conditions update","i scrolled past","the data didnt sync so i left it",
  "the old self is a spam folder","empty and ignored","the notification dot disappeared",
  // ── character evaluation batch ──
  "has hidden variables","many hidden variables","few known variables","has many friends","has a few friends","has no friends",
  "has a lot of friends","is friendly often","is unfriendly often","is mean often","is nice often","is kind often",
  "has kind friends","has mean friends","lies a lot often","lies sometimes","never lies","never lies to friends",
  "often lies to friends","secretly hates others","secretly hates close friends","pretends to be friendly","pretends to be enemies","has many enemies",
  "has few enemies","hates on people","rarely hates on people","jumps the gun","learns quickly often","adaptive and quick",
  "secretly useful","how many secrets","has no secrets","often betrays allies","often betrays friends","had many secrets",
  "had a few secrets","secretly smart","secretly evil","does not believe in evil","does not believe in good","neutral always",
  "is always neutral","is never neutral","always on the fence","loves to fight","loves to argue","subtle manipulator",
  "good manipulator","excellent manipulator","expert manipulator","master manipulator","worst manipulator","very bad manipulator",
  "very good manipulator","thinks they are a genius","not actually smart","understands a lot about the world","has a full soul","has a strong soul",
  "has a weak soul","has a special soul","soul is different","has an old soul","has a new soul","has a powerful soul",
  "has a very weak soul","is soulless","born soulless","never had a soul","lacking a soul","soul is gone now",
  "loses soul in life",
  // ── street vernacular oracle batch ──
  "talks heavy","barely says nothing","all cap","no cap on the dead homies","stay wit the shits","be on go",
  "be on timing","type valid","valid crashout","worth the crashout","not worth the crashout","been through it",
  "been like that","pressed for no reason","mad pressed","always extra","doin the absolute most","doin the least",
  "be on nat nat","be on gang","whole gang solid","whole gang fake","got opps for days","got no opps",
  "runs from the smoke","runs to the smoke","really like that","not really like that","just talkin hot","bout that action",
  "frontin heavy","too comfortable","know their place","dont know their place","sneaky link type","main chick energy",
  "side piece mentality","fumbled the bag","got the bag right","moving mad","moving smart","moving dirty",
  "moving clean","loud and wrong","quiet and right","the plug","the leech","brought the energy",
  "killed the vibe","type to ghost","type to double back","too available","rare commodity","regular degular",
  "one of one","handles business","leaves business messy","sweats the opps","ignores the opps","has receipts",
  "burnt the receipts","keeps the circle small","circle full of randoms","moves like a boss","moves like a worker","real prize",
  "participation trophy","talks in code","talks too reckless","know when to be quiet","never knows when to be quiet","got hidden layers",
  "an open book","straight shooter","sideways hater","lowkey a snake","highkey a rider","builds you up",
  "tears you down slow","plays the long game","wants it now","patience on a hundred","no patience at all","always schemin",
  "never plottin","move in silence","need attention bad","keeps the peace","starts the chaos","is the chaos",
  "is the peace","type to slide","type to hide","built for the pressure","folded under pressure","held it down",
  "let it crumble","came from the mud","never seen the mud","earned every stripe","bought their stripes","really outside",
  "chronically online","on demon time","on angel time","balanced energy","toxic energy","healing energy",
  "draining energy","type to heal you","type to break you",
  "lies often to others",
  // ── honesty ethics morality batch ──
  "rarely lies to others","often lies to family","lies to everyone","lies to no one","lies only to strangers","lies only to close ones",
  "lies when afraid","lies when cornered","lies to protect themselves","lies to protect others","lies without knowing it","lies and believes it",
  "lies then forgets","lies then confesses","lies by omission always","lies by omission sometimes","never lies by omission","comfortable lying",
  "uncomfortable lying","lies under pressure","honest under pressure","lies for convenience","lies for survival","lies for attention",
  "lies out of habit","lies out of fear","lies out of love","lies out of cruelty","lies to feel safe","lies to feel powerful",
  "stops lying eventually","never stops lying","lies less over time","lies more over time","honest to others","honest to friends",
  "honest to family","honest with strangers","honest with themselves","rarely honest with themselves","honest only when asked","honest without being asked",
  "brutally honest","selectively honest","strategically honest","partially honest always","honest at the wrong moment","honest at the right moment",
  "honest to a fault","too honest for their own good","honest but unkind","honest and kind","honest and cold","honest and warm",
  "honest when it costs nothing","honest when it costs everything","honesty is their weapon","honesty is their armor","honesty comes late","honesty comes easily",
  "honesty comes hard","grew into honesty","grew out of honesty","teaches honesty poorly","models honesty well","has moral ethics",
  "has immoral ethics","has no fixed ethics","has situational ethics","has flexible ethics","has rigid ethics","ethics shift with audience",
  "ethics shift under pressure","ethics are performative","ethics are genuine","ethics are inherited","ethics are self invented","questions their own ethics",
  "never questions ethics","lost their ethics slowly","found their ethics late","ethics intact under pressure","ethics collapse under pressure","holds ethics privately",
  "performs ethics publicly","private ethics match public","private ethics differ publicly","steals from others often","never steals from others","steals occasionally",
  "steals only when desperate","steals without guilt","steals with guilt","steals and returns it","steals ideas","steals credit",
  "steals time","steals energy","steals attention","steals from the vulnerable","steals from the powerful","never takes what is not theirs",
  "takes more than their share","takes less than they deserve","takes without asking","asks before taking","gives back what was taken","keeps their word",
  "rarely keeps their word","breaks promises cleanly","breaks promises quietly","owns their mistakes","hides their mistakes","apologizes and means it",
  "apologizes and repeats it","never apologizes","apologizes for everything","takes responsibility","deflects responsibility","admits fault privately",
  "admits fault publicly","blames others first","blames themselves first","holds others accountable","holds no one accountable","holds themselves accountable",
  "excuses themselves always",
  // ── temporal position batch ──
  "late in the day","early in the day","middle of the day","start of the day","end of the day","dead of the night",
  "middle of the night","early in the morning","late in the morning","before the sun rises","after the sun sets","between midnight and dawn",
  "the hour before sleep","the hour after waking","before the world moves","after everyone sleeps","when the light changes","when the dark settles",
  "the quiet before noon","the heavy after three","the long middle hour","when the day turns","when the night opens","before the day decides",
  "early in the week","late in the week","middle of the week","start of the week","end of the week","the monday feeling",
  "the friday feeling","the sunday dread","the saturday ease","midweek heaviness","midweek clarity","the week just started",
  "the week is almost done","the week collapsed early","early in the month","late in the month","middle of the month","start of the month",
  "end of the month","the first week of the month","the last week of the month","before the month turns","after the month resets","the month is almost gone",
  "the month just opened","before the bills arrive","early in the year","late in the year","middle of the year","end of the year",
  "the year just began","the year is almost done","before the year closes","after the year resets","the year turned without warning","the first quarter",
  "the last quarter","mid year reckoning","the year ran out fast","the year dragged slowly","the year changed everything","the year changed nothing",
  "early in the season","late in the season","deep in winter","the edge of spring","the height of summer","the turn of autumn",
  "before the season shifts","after the season breaks","the last cold day","the first warm day","deep in the cold","the long summer middle",
  "when autumn finally arrives","before winter settles in","after winter releases","early in life","late in life","middle of life",
  "early in the relationship","late in the relationship","early in the process","late in the process","early in the grief","late in the grief",
  "early in the healing","late in the healing","before things got hard","after things got hard","before it made sense","after it finally made sense",
  "too early to know","too late to change","right on time","always a little late","always a little early","never quite on time",
];

// ================================================================
// § CATEGORY DEFINITIONS
// Maps category label → Set of normalized phrases belonging to it.
// Built once at module level from the inline catalog below.
// ================================================================

// Each entry: [label, shortLabel, [...phrases]]
// shortLabel is what shows on the pill chip.
const CATEGORY_DEFS = [
  ["states", "states", [
    "irreversible event","fixed point in time","resolved situation","finalized event","completed sequence","terminated process",
    "concluded scenario","expired action","ended phase","closed interval","sealed outcome","observed outcome",
    "witnessed event","experienced moment","recalled incident","reported case","verified history","confirmed past",
    "too close","too far","almost there","not yet there","just arrived","just left",
    "on the edge","off the edge","inside boundary","outside boundary","within range","out of range",
    "in transition","out of transition","mid crossing","pre crossing","post crossing","between points",
    "near limit","far from limit","approaching edge","receding from edge","just inside","just outside",
    "barely within","clearly outside","on boundary line","off boundary line","in the gap","out of the gap",
    "entering zone","exiting zone","pre entry","post exit","mid passage","stalled midway",
    "ahead of boundary","behind boundary","on the verge","at the brink","in the doorway","on the cusp",
    "mid shift","pre emergence","post dissolution","in suspension","in flux","mid recalibration",
    "on the hinge","in latency","pre stabilization","post disruption","in drift","on standby",
    "mid formation","in transit","pre crystallization","post transition","start of the year","early year period",
    "first quarter phase","mid winter stretch","late winter period","early spring phase","mid spring period","late spring stretch",
    "start of summer","early summer phase","mid summer peak","late summer period","early fall phase","mid fall period",
    "late fall stretch","start of winter","early winter phase","mid winter peak","late winter close","quarter one period",
    "quarter two period","quarter three period","quarter four period","first half of year","second half of year","pre holiday period",
    "holiday season window","post holiday period","fiscal year start","fiscal year end","anniversary date window","year end closing period",
    "winter phase","early winter","mid winter","late winter","spring phase","early spring",
    "mid spring","late spring","summer phase","early summer","mid summer","late summer",
    "fall phase","early fall","mid fall","late fall","delayed action","time mismanagement",
    "timing inconsistency","transitional process","shifting awareness","transitional state","temporal accuracy","time aligned action",
    "late sequencing","timing instability","timing mismatch","time window","cycle tracking","duration estimation",
    "onset timing","latency sensitivity","duration awareness","interval management","deadline discipline","time blocking",
    "timing concealment","timing sensitivity","rhythm alignment","phase recognition","cadence control","temporal mapping",
    "time efficient workflow","time compression","time expansion","timing calibration","latency minimization","cycle efficiency",
    "temporal consistency","time budgeting","delay mitigation","schedule resilience","time risk assessment","phase transition control",
    "time horizon awareness","timing alignment","sequence integrity","temporal structure","shifts quickly","temporal stacking",
    "time dilation awareness","cycle anticipation","phase alignment","delay tolerance","timing disruption","window exploitation",
    "sequence locking","rhythm control","latency masking","temporal discipline","time conscious operator","changed plans last minute",
    "timecard fraud","time alibi fabrication","delay tactics","schedule padding","time displacement explanations","pre scheduled action sequence",
    "scheduled progression path","post action evaluation set","deadline contingent action","phase dependent decision path","scheduled fallback sequence","threshold based activation plan",
    "cycle reset action plan","delayed action structure","time offset activation","delayed trigger sequence","latency adjusted workflow","scheduled next step",
    "time gated move","threshold action","time offset task","early start action","ahead of time move","deadline aligned move",
    "late window action","post deadline move","pre margin buffer","time cushion plan","time overrun action","time offset correction",
    "timing compensated move","pre finished step","cycle already run","delayed past action","post deadline completion","deadline met",
    "timeline slipped","milestone skipped","scheduled rollout","deadline approaching","cycle shift expected","phase change ahead",
    "window opening","early warning transition signal","pre transition diagnostic","changes mind with data only","early phase","late phase",
    "on time","ahead of time","behind schedule","just in time","pre phase","post phase",
    "in the moment","arrives ahead of schedule consistently","falls behind without clear recovery","adjusts timing based on feedback","misreads timing under pressure","keeps pace with changing demands",
    "loses track of time easily","operates within strict time limits","extends tasks beyond necessity","rushes decisions without pause","delays action despite readiness","matches tempo of the environment",
    "breaks rhythm under stress","maintains steady timing control","reacts late to emerging signals","anticipates shifts before they occur","hesitates despite adequate information","keeps strict adherence to timelines",
    "abandons schedule under pressure","overextends duration without added value","recovers timing after initial delay","operates ahead of group synchronization","lags behind coordinated efforts","misses critical windows of opportunity",
    "aligns actions with unfolding sequences","breaks sequence continuity under strain","exits before resolution is achieved","tracks time with precise awareness","behind the scenes position","time sensitive role",
    "shift based employment","threshold tuned responder","latent pattern interpreter","phase aligned actor","timing window observer","sequence aware planner",
    "current situation","gradual change","initial phase","intermediate phase","intermediate state","ongoing process",
    "present moment","regular activity","steady state","active framework","current phase","ongoing cycle",
    "regular sequence","alert awareness","present awareness","sharp cognition","active clarity","unstable cognition",
    "unstable focus","unstable thoughts","transient awareness","drifting attention","unstable power dynamic","unstable reporting chain",
    "peak performance","unstable output rate","future oriented thinking","synchronized sequencing","desynchronized sequencing","active phase",
    "active sequencing","current timeframe","current timing","present cycle","present sequencing","peak management",
    "priority scheduling","first aid awareness","continuous improvement","aligns with phases","long term pacing","alignment checking",
    "unpredictable tone","priority distortion","punctual individual","linear reasoning","sharp inference pattern","long term oriented logic",
    "short term decision framing","sudden privacy shifts","future misalignment concealed","past dredging","future cycle alignment","past executed action record",
    "previous cycle breakdown","historical action log","active phase operation","real time task engagement","current cycle alignment","present moment coordination",
    "real time adjustment loop","short term action framework","near future task queue","immediate next step plan","future horizon alignment","cyclical time based system",
    "recurring interval mapping","buffered timeline strategy","future action plan","past action record","previous outcome","active task state",
    "real time action","short term plan","next step action","immediate task","long term plan","future roadmap",
    "deferred step","buffered start plan","exact window action","tolerance aligned move","tight margin timing","wide margin timing",
    "margin corrected action","cutoff approaching","near term arrival indicator","near future state predictor","near term development sign","present role executor",
    "future state planner","initial stage","peak period","general sequence","input sequence","ordinary baseline",
    "repeated cycle","low engagement state","high productivity state","reduced throughput state","conversational flow control","feels connected to cycles",
    "measured risk taking","moves with rhythm","understands flow","flow timing","moves through phases","measured escalation",
    "flow interruption","low warmth baseline","conditional warmth","double standards enforcement","selective transparency windows","content purging cycles",
    "overgeneralization attacks","planned interval activation","retrospective timeline review","live sequence deployment","short window coordination","multi phase deployment structure",
    "conditional time trigger plan","event based action sequence","monthly progression cycle","extended timeline","conditional trigger","repeat sequence",
    "missed window recovery","inside window step","excess duration step","flex window action","incoming phase alert","terminal stage",
    "low period","midpoint phase","general support function","anticipatory sequencing","prepared timing","erratic sequencing",
    "missed timing","poor timing","unsynchronized sequencing","running timing","throughput timing","turnaround speed",
    "instant deployment setup","year scale progression model","cumulative action mapping","if then time alignment","seasonal adjustment plan","staggered task deployment",
    "pause resume action plan","end goal plan","event based step","monthly plan","staggered plan","within margin action",
    "mild distraction","breath held","chest tight","jaw clenched","hands open","shoulders lowered",
    "eyes averted","throat closed","stomach dropped","spine aligned","fists unclenched","neck stiff",
    "brow furrowed","lips pressed","teeth set","palms sweating","fingers twitching","gaze fixed",
    "eyes widened","pulse racing","breath slowed","breath shallow","chest expanded","jaw relaxed",
    "hands clenched","shoulders raised","eyes closed","throat open","stomach knotted","spine curved",
    "fists tightened","neck relaxed","brow smoothed","lips parted","teeth grinding","palms dry",
    "fingers still","gaze shifting","eyes narrowed","you already knew","the doubt is the signal","your body is warning you",
    "you have questions","been here before","the fear is yours","you are being tested","something resists","the grief belongs to you",
    "close to breaking","trust what you felt","emotional instability","fear driven behavior","calm focus","emotional balance",
    "grounded thinking","calm discernment","emotionally centered","grounded awareness","anxious mind","emotional overload",
    "emotional reactivity","emotional volatility","fearful mindset","emotionally flooded","fear saturated thinking","stressed cognition",
    "emotional resonance","emotional calibration","calm under pressure","emotionally guarded","emotional priority","emotionally reactive",
    "emotional anchor","secure channels","mood dependent","emotional gating","attachment regulation","affective buffering",
    "mood stabilization","stress compartmentalization","emotional encoding","emotionally sealed","compassion forward","grounded decision logic",
    "calm analytical baseline","emotional affair","emotional investment outside","jealous monitoring","empathy throttling","jealousy induction",
    "feelings towards","balanced emotional regulation","time moves slowly","moment suspended","years compressed","days stretched thin",
    "the long wait","too long ago","not long enough","time collapsed","the wait continues","felt like forever",
    "over before starting","no time left","borrowed time","running out","just enough time","time well spent",
    "time wasted here","lost years","found moment","stolen hour","suspended between","caught mid stride",
    "frozen in place","rushing past","slipping away","holding still","stretching forward","contracting back",
    "the body remembers","the body forgets","the body knows first","the body speaks last","the body holds it","the body releases it",
    "muscle memory active","muscle memory lost","cellular recognition","instinctive withdrawal","instinctive approach","automatic protection",
    "automatic opening","involuntary reaction","voluntary override","body before mind","mind before body","gut before thought",
    "thought before feeling","the first time","the second chance","the third attempt","the fourth turning","the seventh cycle",
    "the ninth hour","one more time","one last time","once and final","twice removed","three steps back",
    "four walls","five years gone","ten years forward","a hundred small moments","a thousand small cuts","the single thread",
    "the double bind","the triple confirmation","the zero point","at the edge of speech","in the middle of becoming","between two knowings",
    "under the weight of waiting","after the letting go","before the first word","inside the long silence","past the point of defending","beneath the noticing",
    "low grade tension","high frequency anxiety","slow burning resentment","fast moving doubt","steady held fear","rising background joy",
    "quiet persistent hope","flickering certainty","heard my own voice","watched myself doing it","caught myself thinking","stopped myself speaking",
    "noticed the pattern again","felt the old shape","recognized the setup","saw the trap forming","almost trusted them","almost believed it",
    "almost asked why","almost told the truth","almost stayed quiet","almost walked away","almost admitted it","almost let it go",
    "almost stopped caring","almost forgave","waiting on certainty","waiting for clarity","waiting on one sign","waiting on permission",
    "waiting on themselves","stopped waiting finally","still waiting quietly","done waiting now",
  
    "late in the day","early in the day","middle of the day","start of the day","end of the day","dead of the night",
    "middle of the night","early in the morning","late in the morning","before the sun rises","after the sun sets","between midnight and dawn",
    "the hour before sleep","the hour after waking","before the world moves","after everyone sleeps","when the light changes","when the dark settles",
    "the quiet before noon","the heavy after three","the long middle hour","when the day turns","when the night opens","before the day decides",
    "early in the week","late in the week","middle of the week","start of the week","end of the week","the monday feeling",
    "the friday feeling","the sunday dread","the saturday ease","midweek heaviness","midweek clarity","the week just started",
    "the week is almost done","the week collapsed early","early in the month","late in the month","middle of the month","start of the month",
    "end of the month","the first week of the month","the last week of the month","before the month turns","after the month resets","the month is almost gone",
    "the month just opened","before the bills arrive","early in the year","late in the year","middle of the year","end of the year",
    "the year just began","the year is almost done","before the year closes","after the year resets","the year turned without warning","the first quarter",
    "the last quarter","mid year reckoning","the year ran out fast","the year dragged slowly","the year changed everything","the year changed nothing",
    "early in the season","late in the season","deep in winter","the edge of spring","the height of summer","the turn of autumn",
    "before the season shifts","after the season breaks","the last cold day","the first warm day","deep in the cold","the long summer middle",
    "when autumn finally arrives","before winter settles in","after winter releases","early in life","late in life","middle of life",
    "early in the relationship","late in the relationship","early in the process","late in the process","early in the grief","late in the grief",
    "early in the healing","late in the healing","before things got hard","after things got hard","before it made sense","after it finally made sense",
    "too early to know","too late to change","right on time","always a little late","always a little early","never quite on time",]],
  ["patterns", "patterns", [
    "abundant mindset","accurate assessment","active learning","adaptive strategy","adaptive synchronization","aligned intention",
    "aligned output stream","aligned priorities","analytical coherence","anticipatory thinking","authentic presence","balanced perspective",
    "calculated risk taking","calm confidence","clear communication","clear direction","cognitive precision","coherent planning",
    "collaborative effort","consistent output","constructive feedback","creative flow","decisive action","decisive structuring",
    "deep focus","deliberate practice","disciplined effort","dynamic coordination","effective coordination","efficient alignment",
    "elevated awareness","empowered choice","evidence based decision","expanding vision","focused ambition","focused iteration",
    "forward momentum","goal aligned behavior","growth mindset","high accuracy reasoning","high signal thinking","high standards",
    "informed judgment","inner stability","intent driven action","intent synchronization","intentional living","leveraged resources",
    "logical structuring","long term thinking","measured advancement","measured risk","mental clarity","open minded",
    "operational precision","optimized workflow","patient progress","pattern stability","personal evolution","positive outlook",
    "practical wisdom","precision structuring","precision thinking","prioritized action","proactive adjustment","productive routine",
    "purpose aligned output","quality output","rapid learning","rational coordination","refined action flow","resilient mindset",
    "resource calibration","resourceful approach","results oriented","scalable coordination","scalable system","self mastery",
    "self regulation","sharp thinking","signal integrity","situational mastery","solution oriented","steady progress",
    "strategic thinking","strong boundaries","supportive network","sustainable growth","system alignment","systematic improvement",
    "tactical precision","targeted effort","temporal coordination","time efficient process","timely action","unshakeable focus",
    "value coherence","value creation","value driven decisions","winning habits","workflow precision","analysis paralysis",
    "decision fatigue","cognitive fragmentation","overthinking loops","reactive mindset","self sabotage","accurate pattern detection",
    "clear operational logic","disciplined consistency","effective prioritization","functional clarity","informed adaptation","methodical progress",
    "optimized coordination","organized momentum","precision driven output","reliable follow through","stable momentum","system aware action",
    "target clarity","action instability","attention seeking","decision distortion","goal distortion","goal drift",
    "impulsive reactions","logic inconsistency","low awareness","operational breakdown","output distortion","process instability",
    "reasoning distortion","shallow focus","system breakdown","task avoidance","task disruption","workflow instability",
    "decision slippage","operational drag","pattern blindness","process erosion","sequential breakdown","slow adaptation",
    "strategic drift","system friction","adaptive process","average baseline","average output","baseline behavior",
    "current model","default behavior","default setting","default state","dynamic state","functional baseline",
    "nominal baseline","normal variation","objective view","operating state","operational state","process flow",
    "reference baseline","reference point","standard approach","standard baseline","system state","system update",
    "typical baseline","typical pattern","typical range","variable outcome","working model","working state",
    "baseline sequence","default process","dynamic baseline","functional process","normal process","operating framework",
    "pattern recurrence","process sequence","system sequence","variable sequence","adaptive mindset","attentive cognition",
    "attentive state","calibrated thinking","clear mind","clear perception","coherent thoughts","deep awareness",
    "deep concentration","deliberate focus","disciplined focus","focused cognition","focused intent","mental precision",
    "meta awareness","objective awareness","organized thinking","precise cognition","rational awareness","rational control",
    "rational mindset","sharp attention","stable awareness","stable thoughts","structured thinking","thought precision",
    "cognitive steadiness","deep stillness","mental composure","ordered perception","reflective clarity","stable discernment",
    "thoughtful awareness","attention fragmentation","awareness instability","awareness interference","chaotic thinking","cognitive confusion",
    "cognitive distortion","cognitive overload","cognitive saturation","decision confusion","distorted cognition","distorted perception",
    "focus collapse","focus disruption","impulsive thinking","irrational thinking","mental fatigue","mental fog",
    "mental fragmentation","mental rigidity","processing instability","reasoning instability","scattered thoughts","thought instability",
    "thought interference","attention collapse","cognitive scatter","mental agitation","mental clutter","thought clutter",
    "adaptive attention","ambient awareness","background thinking","baseline awareness","baseline cognition","default awareness",
    "default mindset","mental drift","processing cognition","processing input","processing state","standard cognition",
    "standard perception","variable attention","ambient cognition","baseline attention","default cognition","reflective state",
    "standard awareness","thought observation","variable cognition","clear accountability structure","clear chain of command","clear command structure",
    "coherent leadership system","disciplined chain of command","effective command structure","effective leadership tier","functional authority flow","functional authority system",
    "functional hierarchy","layered decision structure","optimized control flow","optimized reporting chain","stable command structure","stable power structure",
    "strategic leadership level","structured leadership flow","structured leadership system","clear decision authority","functional reporting flow","layered accountability system",
    "rational command system","reliable reporting order","stable oversight layer","chaotic command flow","decision congestion","decision gridlock",
    "systemic control failure","unclear reporting structure","decision hoarding","rigid control model","decision hierarchy","decision structure",
    "layered system","system structure","decision layer","accurate performance","optimized output flow","precision throughput",
    "stable output rate","efficiency degradation","output collapse","output instability","performance breakdown","performance decline",
    "performance degradation","performance fatigue","average output level","average output rate","baseline performance","baseline throughput",
    "normal capacity","normal throughput flow","standard performance","typical performance","typical throughput level","variable output",
    "variable throughput","forward planning","forward timing alignment","strategic timing","operating period","disciplined individual",
    "adaptive identity","functional identity","functional role","operational role","pattern recognition in randomness","adaptive tone control",
    "focused attention","platform fluency","abstract generalization","automation thinking","slow to warm up","accurate judgment",
    "strategic questioning","systems level thinking","meaningful connection","metadata awareness","pattern disruption","edge case anticipation",
    "interface mastery","analytical depth","task sequencing","creative application","network understanding","strategic foresight",
    "decision under uncertainty","structured reasoning","encryption handling","layered messaging","probabilistic reasoning","heuristic refinement",
    "critical timing","slow to trust","reliable performance","algorithmic efficiency","encryption discipline","architectural clarity",
    "process automation","scalable solutions","dynamic adaptation","goal oriented mindset","performance tuning","systematic approach",
    "scalable design","iterative refinement","mental state monitoring","network expansion","algorithmic reasoning","performance maximization",
    "deeply affected","operational tempo","redundancy planning","mentally restless","cognitive flexibility","operational integrity",
    "metabolism awareness","cognitive compression","rigid preferences","rapid adaptation","pattern abstraction","operational clarity",
    "signal processing awareness","meta level reasoning","structured mindset","performance consistency","consistent attraction","conceptual mapping",
    "clarity under pressure","framework construction","system monitoring","debugging persistence","synthesis under pressure","deep attachment",
    "processes internally","strategic ambiguity","pattern inversion","perception anchoring","meaning extraction","decision layering",
    "cognitive partitioning","attention steering","abstract layering","mental simulation","logic distortion","heuristic pruning",
    "model abstraction","system mirroring","variable isolation","decision compression","meaning construction","behavioral scripting",
    "habit encoding","routine stabilization","action stacking","discipline reinforcement","consistency tracking","output scaling",
    "performance calibration","efficiency tuning","focus narrowing","distraction elimination","error correction","iteration control",
    "quality assurance","system building","workflow structuring","signal processing","encryption mindset","access control",
    "network mapping","interface fluency","automation layering","debugging discipline","architecture planning","redundancy design",
    "security awareness","load balancing","failure anticipation","recovery structuring","edge case handling","scalability planning",
    "broad shoulders","reliable networker","consistently benevolent","intuitive interpreter","pattern of delay","precision timed",
    "strategic network asset","sequential logic","parallel processing thought","inductive patterning","deductive structuring","abductive inference",
    "analogical mapping","heuristic driven judgment","abstract formulation","counterfactual modeling","forward chaining logic","backward chaining logic",
    "multi variable analysis","recursive reasoning","meta cognitive processing","rapid inference cycles","slow deliberative logic","precision oriented thinking",
    "structured deduction","decision theoretic reasoning","process oriented reasoning","clear headed reasoning","slow but thorough logic","pattern sensitive reasoning",
    "balanced evaluation style","consistent logical structure","adaptive thinking model","flexible inference approach","rigid rule based logic","impulsive inference style",
    "tactical reasoning focus","high signal detection","metadata manipulation","deepfake deployment","parallel relationship","decision pre commitment",
    "forward timed operation set","completed phase summary","forward timeline","completed task log","action history","strategic sequence",
    "precision timed step","edge case timing","narrow window action","precision bound step","completed action","finished task",
    "fixed prior outcome","problem eliminated","error corrected","system restored","process broke","output degraded",
    "standard ignored","target window nearing","system upgrade pending","process improvement planned","efficiency increase expected","performance boost projected",
    "forward looking transition sign","forward event precursor","forward shift trigger","forward phase indicator","actions taken","system maintains",
    "performance evaluator","clear communicator","same routine every day","asks for exact deadlines","uses only bullet points","solves problems alone first",
    "measures deliverables not hours","arrives two minutes early","turns tasks into checklists","adds buffer days","shares budgets and delays openly","answers weekend in one sentence",
    "replaces soon with a date","sends recaps after meetings","ships working prototypes","follows a fixed review checklist","rejects most first drafts","learns from docs not people",
    "hires for portfolio not years","closes all other tabs","same lunch time daily","phone in another room","finishes one task before next","double checks all numbers",
    "carries backup charger and cash","traces problems back three steps","waits before replying","protects time for high impact work","sharp attention to detail","limited awareness of context",
    "unclear internal guidance","consistent follow through on tasks","clear communication under tension","steady decision making process","erratic judgment under strain","scattered approach to effort",
    "rigid adherence to routine","accurate self assessment ability","distorted perception of capability","clear skin texture","broad shoulder frame","narrow shoulder frame",
    "flexible schedule role","adaptive identity formatter","dynamic stance adjuster","precision framed speaker","advanced situational awareness","applied intelligence",
    "balanced judgment","capacity expansion","coordinated problem solving","credible judgment","energetic discipline","evaluative precision",
    "high trust behavior","intentional discipline","practical foresight","predictive awareness","resolved direction","selective focus",
    "structural coherence","successful adaptation","trustworthy conduct","unified direction","aimless progression","assumption error",
    "avoidant behavior","bad decisions","blind risk taking","broken coordination","broken focus","careless actions",
    "chasing validation","chronic distraction","clouded judgment","conflicting priorities","constant doubt","coordination instability",
    "destructive habits","directional confusion","disorganized thinking","empty promises","erratic behavior","excessive caution",
    "false confidence","faulty assumptions","faulty structure","forced outcomes","inaccurate assessment","inconsistent effort",
    "information overload","input inconsistency","intent confusion","lack of discipline","miscommunication","misdirected output",
    "mismanaged resources","misplaced priorities","negative self talk","no accountability","noise disruption","overcommitment",
    "overextension","poor coordination","poor judgment","premature action","priority confusion","reactive decisions",
    "reckless behavior","resource depletion","resource inefficiency","risk blindness","scope creep","short sighted decisions",
    "short term thinking","stagnant growth","structural instability","toxic patterns","unforced errors","unfocused energy",
    "unreliable behavior","unstructured approach","value leakage","value misalignment","wasted effort","wasted potential",
    "weak boundaries","zero direction","zero signal clarity","accuracy loss","agitated behavior","aimless motion",
    "avoidance pattern","blunted awareness","collapsed structure","confused priorities","coordination failure","counterproductive action",
    "degraded output","disconnected effort","disrupted planning","drifting intent","error prone process","failure cascade",
    "faulty prioritization","fragmented workflow","hesitant action","imbalanced effort","incomplete follow through","miscalculated risk",
    "misread context","panic driven action","routine neglect","short range fixation","skill erosion","state confusion",
    "unstable process","agitated thoughts","high trust hierarchy","cybersecurity awareness","long range task sequencing","measured process",
    "steady process","calculated thinking","composed cognition","composed thinking","direct awareness","direct perception",
    "efficient cognition","enhanced clarity","expanded awareness","high clarity state","intentional focus","lucid awareness",
    "perceptual clarity","quiet confidence","refined awareness","relaxed control","steady awareness","sustained attention",
    "sustained cognition","zero distortion awareness","attuned awareness","composed attention","cool headed thinking","directed cognition",
    "discerning mind","even minded focus","lucid thinking","measured cognition","mindful precision","peaceful focus",
    "perceptual steadiness","quiet alertness","settled awareness","steady perception","confused thinking","defensive mindset",
    "distracted mind","indecisive thinking","information distortion","negative spiral","obsessive thinking","overthinking loop",
    "panic state","paranoid thoughts","perceptual bias","perceptual noise","racing thoughts","reactive cognition",
    "rumination cycle","sensory overload","tunnel vision","unfocused state","compulsive rumination","defensive thinking",
    "disturbed focus","fixated thoughts","fogged perception","fractured cognition","perceptual drift","reactive attention",
    "spiraling attention","state fragmentation","tense awareness","uncentered thinking","unsettled awareness","volatile attention",
    "worn down thinking","zeroed out focus","fluctuating attention","general awareness","general cognition","idle mind",
    "low engagement awareness","low intensity focus","momentary focus","observing thoughts","ordinary thinking","resting mind",
    "situational awareness","steady cognition","temporary confusion","uncommitted focus","undirected focus","unstimulated mind",
    "casual awareness","even awareness","general processing","low demand cognition","ordinary awareness","passing thought state",
    "plain awareness","temporary focus","efficient command chain","efficient reporting structure","top tier decision making","efficient leadership structure",
    "empowered decision layer","rank distortion","high efficiency output","maximum output","maximum output stability","optimal performance state",
    "refined throughput state","sustained performance","low efficiency output","low output rate","throughput instability","steady output",
    "steady output rate","long range planning","high agency mindset","nonlinear reasoning","noise injection","contamination awareness",
    "preferred focus","noise isolation","api awareness","version control discipline","nutrition awareness","nonverbal awareness",
    "behavioral camouflage","failure mode analysis","recovery planning","withdrawal awareness","indirect communication","dependency awareness",
    "reactive under pressure","craving awareness","information filtering","lag analysis","effortless coordination","sustained enthusiasm",
    "overdose awareness","heart driven focus","credibility signaling","naloxone awareness","modular thinking","insider risk awareness",
    "detail oriented focus","legal awareness","supply variability awareness","clock discipline","second guesses decisions","deployment awareness",
    "cross tolerance awareness","intentional practice","polysubstance awareness","refined technique","follow up discipline","pharmacology awareness",
    "half life awareness","harm reduction planning","shapes perception","cultural awareness","medical consultation awareness","psychological misdirection",
    "teaching clarity","direct negotiation","decoy signaling","trade off evaluation","information synthesis","enjoys recognition",
    "driven when focused","all or nothing effort","intense bursts of effort","information asymmetry","perceptual gating","dual channel thinking",
    "idea synthesis","causal tracing","sustained pacing","impulse redirection","bias recognition","requires direction",
    "requires discipline","requires effort","information restrictive","instrumental with others","field sensitive perception","deterministic logic",
    "rule based analysis","principle centered thinking","concrete reasoning","symbolic manipulation logic","reductionist analysis","comparative reasoning",
    "retrospective analysis","evidence weighted judgment","bias resistant reasoning","noise tolerant inference","trade off aware reasoning","fractal pattern recognition",
    "high coherence reasoning","low coherence reasoning","ambiguity averse logic","game theoretic thinking","risk calibrated judgment","evidence driven thinking",
    "intuition backed judgment","detail oriented analysis","hesitant but careful reasoning","exploratory reasoning style","insight heavy processing","emotion filtered reasoning",
    "emotion influenced judgment","reactive thought pattern","noise prone interpretation","assumption checking mindset","correlation based thinking","principle aligned reasoning",
    "experience driven judgment","theory first thinking","practice first reasoning","information leakage","cover up effort","quiet settlement",
    "double dating pattern","testing alternatives quietly","family information withheld","planning exit without notice","conversation redirection loops","information drip control",
    "account compartmentalization","information harvesting","elapsed phase analysis","hour based planning grid","compressed timeline strategy","extended cycle planning",
    "over margin drift","recognition earned","preparatory arrival signal","strong sense of direction","limits access to inner thoughts","data interpretation",
    "test verification","code switching","database querying","cipher usage","relevance selection","engagement management",
    "emergency readiness","event synchronization","benchmark alignment","moment selection","behavioral regulation","digital problem solving",
    "feature implementation","technical documentation usage","data structuring","knowledge transfer","stakeholder alignment","expectation setting",
    "intermediary use","dependency management","blind spot creation","conversation steering","intent buffering","selective amplification",
    "symbolic encoding","behavior shaping","expectation bending","concept fusion","nonlinear mapping","insight stacking",
    "knowledge compression","error anticipation","scenario modeling","probability shaping","risk absorption","momentum capture",
    "pacing manipulation","energy budgeting","internal calibration","intensity scaling","engagement pacing","internal referencing",
    "belief auditing","ego containment","value calibration","causal inference","predictive inference","big picture framing",
    "decisive conclusion making","resilience engineering","build management","cloud navigation","data sanitization","environment setup",
    "cross platform operation","contact retention","tech stack alignment","label accuracy","brand consistency","firmware handling",
    "storage safety","shadow documentation","earned trust","silent resentment","mutual recognition","unspoken agreement",
    "growing distance","shifting power balance","calculated vulnerability","strategic withdrawal","reciprocal loyalty","managed expectations",
    "deliberate avoidance","performative harmony","conditional support","negotiated respect","competing commitments","shared silence",
    "deferred confrontation","tactical generosity","uneven investment","fragile alliance","calculated kindness","withheld approval",
    "testing loyalty","keeping options open","lowering defenses slowly","performed interest","guarded optimism","strategic forgetfulness",
    "redirecting blame","claiming neutrality","rehearsed empathy","managing perceptions","saving face","offering leverage",
    "withdrawing attention","escalating gently","bartering affection","matching effort exactly","holding back","testing boundaries",
    "feigning ignorance","overcompensating visibly","shifting allegiances","downplaying conflict","delaying commitment","control disguised as care",
    "silent treatment as punishment","keeping score of past mistakes","conditional affection","withholding communication","deflecting accountability","chronic criticism",
    "backhanded compliments","public disrespect","private resentment","gaslighting perceptions","jealousy framed as loyalty","ultimatums over dialogue",
    "blame shifting","emotional withdrawal","passive aggressive remarks","invalidating feelings","avoiding difficult conversations","breaking trust repeatedly",
    "overstepping boundaries","ignoring boundaries","manipulation through guilt","playing victim to avoid fault","inconsistent behavior","hot and cold attention",
    "refusing to apologize","comparing to others","testing loyalty constantly","controlling decisions","monitoring independence","disrespecting time",
    "chronic unreliability","financial secrecy","emotional dependency pressure","using silence to dominate","cheating on them","someone is cheating",
    "secretive texts","talking to ex","common pattern","common workflow","well structured thinking","well ordered mind",
    "conflicted perception","conflicted thinking","respected authority figure","trusted decision maker","well ordered system","trusted leadership structure",
    "well governed system","conflicted authority","conflicted command structure","disconnected leadership","toxic power structure","weak leadership tier",
    "dysfunctional reporting chain","trusts intuition over logic","valued pursuit","conflict de-escalation","boundary setting","safe setting awareness",
    "trusted supervision","trust building","rapport establishment","connection bridging","mutual value exchange","social positioning",
    "warm introductions","socially observant","boundary definition","conflict containment","connection filtering","boundary enforcement",
    "trust gating","distance calibration","social mirroring","interaction pruning","loyalty testing","social manipulator",
    "socially distant","ignored their advice","friends kept separate","social circle segmentation","intimacy avoidance","boundary violations concealed",
    "shared asset ambiguity","cold warm oscillation","loyalty trials","weekly action loop","weekly loop","boundary window action",
    "safety window step","competition won","social performer","coordinated leadership network","builds personal systems","takes things personally",
    "cross group communication","builds personal mythology","wounds close up","different behavior in private","leaking private details","agenda setting in private",
    "habitual deception","chronic avoidance","performative virtue","quiet betrayal","selective memory","convenient principles",
    "broken promises ignored","self excusing pattern","shifting blame outward","emotional stinginess","refusal to apologize","rewriting shared history",
    "privileging own comfort","withholding due credit","feigning helplessness regularly","strategic incompetence","loyalty until inconvenience","kindness with terms",
    "generosity as debt","accountability for others only","forgiveness for self","admiration for appearance","contempt for weakness","entitlement disguised as need",
    "resentment nursed privately","jealousy masked as concern","weaponized vulnerability","chronic promise breaking","moral licensing","selective outrage",
    "virtue hoarding","convenient amnesia","self deception mastered","punishing honesty","rewarding flattery","quitting when costly",
    "blaming circumstance forever","never the villain","always the victim","forgiving self instantly","judging others harshly","taking without asking",
    "giving to control","helping to indebted","listening to reply","apologizing without change","admitting fault never","learning nothing new",
    "trusting only mirrors","respecting selectively","explaining away harm","feigning ignorance routinely","testing loyalty needlessly","withholding forgiveness deliberately",
    "demanding trust unconditionally","offering trust never","keeping score silently","resenting unspoken expectations","claiming misunderstanding often","escaping accountability gracefully",
    "performing remorse poorly","repeating offenses calmly","ignoring feedback entirely","celebrating small decencies","excusing large cruelties","nursing grudges indefinitely",
    "forgetting debts conveniently","remembering slights perfectly","giving warnings subtly","striking without warning","smiling while sabotaging","praising to disarm",
    "apologizing to end discussion","changing subject skillfully","covert agenda","masked intention","subtle manipulation","concealed motive",
    "quiet control","disguised influence","hidden resentment","unspoken expectation","passive compliance","strategic omission",
    "selective honesty","partial disclosure","information hoarding","behind the scenes steering","indirect pressure","emotional undercurrent",
    "veiled criticism","double meaning speech","plausible deniability","feigning innocence","calculated silence","timed withdrawal",
    "soft coercion","micro manipulation","implied threat","nonverbal signaling","coded language use","shadow negotiation",
    "invisible boundary setting","subconscious testing","quiet triangulation","false transparency","curated persona","hidden alliance",
    "influence without ownership","detached observation","internal scoring","behavioral masking","covert misconduct","clandestine violation",
    "hidden breach","unauthorized action","illicit operation","backchannel dealing","off record behavior","concealed infraction",
    "unreported incident","stealth exploitation","shadow dealing","quiet collusion","undisclosed conflict of interest","falsified record",
    "data manipulation","document tampering","evidence suppression","obstruction of oversight","unseen authority","implicit control structure",
    "hidden order system","inaudible command network","subtle dominion field","invisible rule set","covert influence grid","nonverbal power structure",
    "parallel identity curation","selective memory editing","truth staging","omission by design","micro lie stacking","context stripping",
    "half truth deployment","plausible deniability framing","preemptive justification building","conflict rehearsing","scripted apologies","timed affection bursts",
    "intermittent reinforcement","reward withdrawal cycling","emotional breadcrumbing","future faking","commitment mirage","exit ramp preparation",
    "fallback partner positioning","soft breakup seeding","gradual disengagement","intimacy rationing","vulnerability gating","attachment testing",
    "boundary probing","gaslight cycles","reality reframing","minimization patterns","victim stance rotation","crisis fabrication",
    "urgency pressure","ultimatum staging","exit threats","breakup rehearsal","return bargaining","cycle repetition",
    "signal interference","signal noise confusion","signal confusion","contextual thinking","exploitative leadership","reporting confusion",
    "suppressed accountability","reporting model","reporting structure","reporting chain","context dependent role","contextual identity",
    "signal suppression","message precision","signal extraction","reads between realities","narrative structuring","alias management",
    "signal clarity","access gating","narrative control","tracks timing naturally","log awareness","reads the room",
    "subtext recognition","signal prioritization","narrative positioning","signal dominance","context override","frame shifting",
    "interpretive control","subtext injection","signal reading","narrative shielding","exploits connections","context sensitive evaluation",
    "signal focused evaluation","boundary aware thinking","ambiguity tolerant reasoning","context aware interpretation","privilege escalation","kickback arrangement",
    "record alteration","shell arrangement","surreptitious conduct","under the table exchange","off ledger activity","quiet fraud",
    "hidden embezzlement","concealed laundering","untraceable transfer","backdated authorization","forged approval","fabricated documentation",
    "tampered audit trail","suppressed reporting","obfuscated records","data scrubbing","log deletion","chain of custody breach",
    "evidence planting","false attestation","misstated figures","revenue inflation","expense padding","invoice splitting",
    "double billing","phantom vendor","ghost payroll","procurement collusion","bid rigging","price fixing",
    "kickback channel","self dealing","nepotistic hire","crony contract","insider trading","front running",
    "market manipulation","wash trading","spoofing orders","account takeover","credential harvesting","keylogging scheme",
    "unauthorized surveillance","covert monitoring","backdoor access","rootkit installation","privilege abuse","shadow account",
    "alias operation","sockpuppet network","astroturfing campaign","disinformation seeding","asset stripping","proxy ownership",
    "nominee account","trust concealment","shell layering","circular transactions","round tripping","false flag operation",
    "trade secret theft","confidential leak","source exposure","witness tampering","perjury coordination","jury interference",
    "obstruction scheme","recording arguments secretly","narrative monopolizing","tracked completion","record broken","communication failed",
    "signal ignored","explains action before doing it","signals without full explanation","situational role shifter","boundary aware operator","context switching specialist",
    "signal reading communicator","subtle cue reader","environment scanning agent","internal state regulator","external pressure modulator","feedback loop calibrator",
    "ambiguity tolerant processor","multi layer perception user","abuse of authority","misused authority","projects intent mentally","guards personal space",
    "abuse of access","compartmentalized life","deflection patterns","stonewalling intervals","projection loops","keeps motives concealed",
    "guards personal history tightly","withholds critical details","deflects direct questioning","hides intent behind humor","protects sensitive information","leaks hints without clarity",
    "redirects attention when probed","compartmentalizes private matters","keeps past actions obscured","reveals fragments not the whole","keeps deeper meaning concealed","hides a second identity",
    "conceals financial instability","keeps past affiliations buried","covers up legal trouble","maintains hidden relationship","denies prior commitments","hides true source of income",
    "conceals addiction patterns","keeps family conflict secret","withholds educational history","hides previous identity change","conceals disciplinary record","hides ongoing investigation",
    "conceals digital footprint traces","hides prior agreements","project based contract","balanced authority structure","coordinated command system","earned authority level",
    "empowered leadership tier","responsive authority system","capable authority network","competent authority layer","ethical authority structure","guided authority model",
    "legible power structure","merit based authority","manipulated authority","overcentralized power","political hierarchy games","unearned authority",
    "unchecked authority","level of authority","positional order","rank order system","structural hierarchy","order structure",
    "hydration control","finds power in repetition","believes words carry force","treats language as influence","environment control","uses speech as leverage",
    "key control","internal reward","balances opposing forces","update control","public speaking control","continuity control",
    "protective of energy","filters influences","protective of close ones","silent leverage","impulse suppression","recovery spacing",
    "pressure modulation","desire filtering","reciprocity control","exposure limitation","order driven habits","limited approachability",
    "flattering to exploit","circumvention of controls","bribery attempt","backdated entry","unlawful concealment","covert sabotage",
    "concealed boundaries","covert comparison to others","financial concealment","location withholding","blame redistribution","device guarding",
    "testing loyalty covertly","preemptive blame assignment","device access asymmetry","contact name masking","notification filtering","search history control",
    "subscription concealment","affection on demand","data retention for leverage","responsibility deflection","reveals little under pressure","physically demanding work",
    "entry level position","trace minimization","dead drop usage","counter surveillance","route variation","ephemeral communication",
    "footprint reduction","obfuscation tactics","reputation management","reputation shielding","expectation management","diplomatic phrasing",
    "persuasive delivery","policy evasion","compliance breach","insider misuse","unauthorized disclosure","misappropriation of assets",
    "diversion of funds","fraudulent activity","impersonation","account compromise","witness intimidation","ghost transaction",
    "phantom billing","front operation","underground exchange","off books transaction","side agreement","coordinated inauthentic behavior",
    "account laundering","stolen asset liquidation","diversion scheme","off balance sheet liability","side letter arrangement","non arm length deal",
    "hush payment","sealed agreement","forum shopping","jurisdiction hopping","sanctions evasion","smuggling conduit",
    "contraband routing","black market exchange","underground brokerage","industrial espionage","physical infidelity","secret messaging thread",
    "deleted conversations habit","alternate account use","maintained backup options","flirtation minimization","selective disclosure of history","omitted encounters",
    "unspoken dealbreakers","idealizing someone else","secret resentment buildup","internal scorekeeping","unvoiced dissatisfaction","secret spending",
    "unexplained absences","image management online","curated persona mismatch","selective truth framing","withheld affection","password secrecy escalation",
    "third party triangulation","confiding in outsiders first","legal or housing plans hidden","relocation consideration hidden","rules that shift","choice illusion offering",
    "topic shutdown cues","reputation pre framing","image laundering","privacy escalation spikes","location opacity","unverifiable errands",
    "unaccounted gaps","channel switching","ephemeral messaging reliance","archive hiding","financial partitioning","cash channel usage",
    "off plan expenditures","debt minimization narratives","validation rationing","comparison seeding","insecurity triggering","confession fishing",
    "argument recording","quote weaponization","grievance stockpiling","forgiveness without reset","apology inflation","take control",
    "make a decision","set a boundary","hold position","change direction","start the process","stop the action",
    "pause briefly","resume movement","end the cycle","build structure","break pattern","shift focus",
    "adjust timing","refine output","gain access","lose access","grant permission","deny entry",
    "restrict movement","create value","reduce waste","increase effort","limit exposure","balance input",
    "observe quietly","analyze patterns","measure results","track progress","verify accuracy","lead forward",
    "follow direction","support others","challenge authority","negotiate terms","form connection","cut ties",
    "repair damage","restore trust","test loyalty","hide intent","reveal truth","mask identity",
    "signal awareness","plan ahead","react quickly","adapt rapidly","anticipate change","prepare outcome",
    "intent alignment","becoming aware","becoming numb","becoming certain","becoming lost","becoming clear",
    "becoming confused","becoming present","becoming distant","becoming still","becoming restless","becoming ready",
    "becoming reluctant","moving toward resolution","moving toward collapse","approaching stillness","approaching chaos","entering clarity",
    "leaving certainty","crossing into unknown","returning to known","yields under pressure","holds under pressure","bends without breaking",
    "breaks without bending","resists without force","forces without resistance","pushes through anyway","stops at the boundary","redirects the force",
    "absorbs the impact","deflects the blow","compounds the pressure","releases the tension","builds the pressure","holds the tension",
    "collapses under weight","rises under weight","recovers from collapse","too much too soon","not enough not yet","exactly enough",
    "slightly over","barely under","well within range","far outside range","at the outer edge","at the inner core",
    "surface level only","all the way through","halfway there","three quarters done","just past the midpoint","approaching completion",
    "receding from start","moving toward center","moving away from center","pulling inward","pushing outward","chose to stay anyway",
    "chose to leave instead","chose silence over war","chose honesty over ease","chose the slower path","chose not to chase","chose to see it fully",
    "chose the uncertain door","showed up anyway","tried again slower","stopped trying to convince","stopped explaining","said less each time",
    "said more than needed","kept going past the point","quit exactly on time","held space for","made room for","closed the door on",
    "opened a window to","built a bridge to","burned a bridge with","drew a line with","crossed a line with","kept the door open",
    "locked it all up","drew them closer","held them at distance","mirrored their pace","broke their rhythm","matched their frequency",
    "shifted their mood","anchored their instability","amplified their doubt","softened their edge","sharpened their focus","disputed ground",
    "shared loss","unclaimed win","borrowed credibility","stolen attention","inherited conflict","unearned rest",
    "purchased loyalty","owed apology","forgiven debt","owed a favor","owed an explanation","owed the truth",
    "owed nothing back","owes only themselves","holds no debts","carries old promises","keeps forgotten agreements","non-answer compliance",
    "sounds cooperative stays evasive","fragmented narrativizing","weaponized confusion","keeps interaction murky to retain upper hand","language inflation","bluntness as alibi",
    "calls aggression honesty","chronic caveating","hyperexplicitness after rupture","unstated asks","escalates to regulate","conflict avoidance by appeasement",
    "yields quickly stores resentment","delayed eruption pattern","swallows early signals detonates later","punitive withdrawal","distance used as punishment","counterattack reflex",
    "responds to hurt with offense","righteous flooding","moral certainty rises with overload","conflict as intimacy","feels closest in charged states","conflict illiteracy",
    "cannot separate disagreement from threat","repair avoidance","scorched-earth impulse","destroys ground once activated","micro-retaliation pattern","distributes injury in deniable doses",
    "scorekeeping mentality","tracks conflict like a ledger","historical stacking","absolutist escalation","exit threats as leverage","invokes departure to gain control",
    "submission then sabotage","complies outwardly resists covertly","values dominance over understanding","humiliation defense","reactive misattunement","hears attack where nuance exists",
    "provocation seeking","rupture addiction","familiar with chaos mistrusts calm","post-conflict amnesia","wants storm forgotten without repair","compelled clarification after rupture",
    "truth dump under threat","becomes brutally accurate when cornered","conflict fogging","muddies specifics to escape ownership","moral inversion in conflict","submission collapse",
    "loses coherent voice under confrontation","freeze in confrontation","cognition drops when tension spikes","hyperarticulate fighting","fearful placation","vengeance drift",
    "contrarianity under shame","opposes because yielding feels annihilating","hostile compliance","performs agreement with embedded refusal","indirect contesting","repair longing repair incapacity split",
    "shame-rage sequence","exposure quickly converts into anger","correction intolerance","feedback feels like ego injury","humiliation vigilance","scans for disrespect or diminishment",
    "defensive superiority","contempt used to avoid inferiority","collapse under criticism","minor critique triggers major self-loss","counterphobic pride","acts fearless to suppress shame",
    "prestige dependence","needs esteem to stay organized","concealed inadequacy complex","image or achievement covers defectiveness","injury memorization","pride rigidity",
    "cannot soften without feeling lowered","apology resistance","remorse threatens self-structure","false modesty defense","self-deprecation used to preempt attack","pre-shaming self",
    "insults self before others can","perfectionistic shame management","tries to become uncriticizable","shame by comparison","collapses near perceived superiority","defensive preciousness",
    "ordinary friction feels disproportionately wounding","grandiosity after diminishment","self-inflation follows ego wound","self-exonerating pride","protects innocence over truth","moral vanity",
    "competence narcissism","exposure dread","fragile distinction needs","requires specialness to outrun worthlessness","shame-driven generosity","shame-fueled overachievement",
    "performs to silence inner accusation","dignity deficit","self-reproach loop","turns mistakes into character indictment","prickly self-regard","highly reactive to puncture",
    "brittle confidence","appears solid until challenged","invisible shame posture","body and language apologize without words","honor fixation","affective flooding",
    "emotion rises faster than regulation","affective blunting","mood-governed functioning","emotional weather dictates behavior","suppressed grief field","sorrow is present but unprocessed",
    "anger as cover emotion","tear inhibition","body resists release even when pain is active","emotion phobia","treats feeling itself as dangerous","rage dependency",
    "anger provides temporary coherence","numbness as refuge","affective lability","tenderness inhibition","delayed emotional processing","borrowed affect",
    "empathic overidentification","cannot distinguish resonance from takeover","contagion susceptibility","atmosphere enters quickly","emotional underlabeling","feels strongly names poorly",
    "sorrow saturation","grief becomes ambient background","displaced grief activity","pleasure guilt","enjoyment triggers accusation","joy suspicion",
    "hope aversion","avoids optimism to reduce disappointment","sentimental defensiveness","emotional inversion","reactive tenderness withdrawal","affect leakage",
    "unspoken feeling emerges through body timing or tone","emotionally top-heavy mind","underfelt anger","cannot access rightful aggression","overmobilized anger","anger arrives faster than thought",
    "relief shame","feels guilty when burden lifts","ambivalent longing","wants and fears nourishment simultaneously","threat-biased interpretation","fills ambiguity with danger",
    "confirmation-hungry mind","notices what supports prior fear","projection-led perception","sees disowned material outside first","black-and-white cognition","complexity collapses under stress",
    "catastrophic forecasting","overestimates negative trajectory","narrative overfitting","pattern compulsion","suspicion priming","mind-reading bias",
    "infers intent without checking","interprets neutral events as self-referential","dichotomous moral parsing","cognitive rigidity","hyperanalytic distancing","thinks about rather than through",
    "conspiracy susceptibility","hidden-order explanations soothe uncertainty","symbolic overreach","emotion-as-evidence cognition","feels true therefore assumes true","data selectivity",
    "attends to threat ignores repair","premature closure thinking","lands fast to avoid ambiguity","defensive certainty","conviction rises where doubt lives","paranoid elaboration",
    "interpretive inflation","self-referential filtering","nuance collapse under arousal","subtlety disappears when activated","meaning extraction drive","reality testing strain",
    "inner narrative outranks external feedback","conceptual grandiosity","psychological absolutism","treats tendencies like destinies","doubt intolerance","uncertainty itself feels unbearable",
    "cognitive moralism","prefers rightness over accuracy","elegant explanation addiction","beautiful theory displaces messy truth","interpretive vigilance","always reading beneath surfaces",
    "negative filtering bias","good data fails to consolidate","hostile attribution style","harmful intent assumed readily","hope-disqualifying cognition","neutralizes positive possibilities preemptively",
    "intellectualization defense","substitutes analysis for contact","start-stop cycle","begins strongly cannot sustain","threshold collapse","self-sabotage by delay",
    "lets openings decay through postponement","success intolerance","progress becomes dysregulating","chaos loyalty","routine aversion","mistakes structure for entrapment",
    "compulsive reset behavior","keeps beginning avoids continuing","last-minute intensity dependence","mobilizes only under pressure","productive avoidance","procrastinative self-protection",
    "delay prevents definitive self-measurement","collapse after momentum","perfectionism paralysis","impulse override failure","white-knuckle discipline","boredom intolerance",
    "abandons what lacks novelty","routine destabilization need","disrupts steadiness to feel alive","authority-reactive noncompliance","learned helplessness","underacts despite real agency",
    "agency diffusion","goal fog","action inhibition by shame","habit fragility","small disruptions break the system","overscheduling as anxiety management",
    "productivity used to quiet chaos","underfunctioning in key domains","recreational self-undoing","micro-avoidance architecture","pseudo-commitment","intention language without matching behavior",
    "crisis dependency","threshold fear disguised as laziness","pleasure-first derailment","chooses relief over long-range integrity","structural self-neglect","neglects basics that preserve stability",
    "compulsive detouring","identity lag behavior","environmental defeatism","insight exceeds follow-through","delayed self-respect","behaves as though care can wait",
    "control-seeking under uncertainty","power used as anti-anxiety","micromanaging reflex","dominance compensation","control expands where helplessness lives","subtle authoritarianism",
    "insists without appearing to insist","power through opacity","dependency engineering","creates need to prevent abandonment","plausible-deniability control","moral high-ground domination",
    "governs through righteousness","intellectual domination","emotional temperature control","withholding as power","grants and retracts access strategically","access management",
    "dispenses closeness like a reward","intermittent reinforcement style","inconsistency intensifies attachment","fragility as control","collapse used to halt challenge","helplessness performance",
    "becomes impossible to oppose","charm-based authority","influence routed through likability","status preoccupation","tracks rank constantly","submission extraction",
    "prefers others softened apologetic uncertain","boundary testing as hierarchy check","probes limits to gauge power","correction as dominance ritual","enjoys being the definitional authority","invisible ownership stance",
    "acts as though others time or loyalty are owed","covert one-upmanship","tiny moves preserve superior position","decision monopolizing","centralizes choice to reduce unpredictability","jealous territoriality",
    "power panic when ignored","low attention feels like demotion","hierarchical sensitivity","influence dependency","control loss intolerance","uncertainty becomes aggression or panic",
    "sovereignty confusion","mistakes domination for self-possession","boundary porosity","boundary rigidity","overhardens after invasion","self-other blur",
    "guilt-boundary conflict","limits feel cruel","permission-based limits","delayed no","recognizes personal limits too late","overresponsibility for others feelings",
    "intrusion normalization","boundary testing tolerance","boundary collapse under attachment threat","moralized self-sacrifice","treats self-denial as goodness","self-abdicating care",
    "reactive walling","goes from overopen to unreachable","overdisclosure without containment","privacy as self-preservation","secrecy built from insufficient safety","compulsive availability",
    "feels unable to stay inaccessible","relational overextension","commits beyond sustainable capacity","emotional trespass","enters others interiority without invitation","fixing compulsion",
    "intervenes where witnessing would suffice","boundary shame hangover","feels guilty after necessary assertion","reciprocity confusion","gives without assessing mutuality","enmeshment drift",
    "self-negotiation habit","bargains against own instincts","containment deficit","cannot hold others affect without merging","lack of internal perimeter","overguarded autonomy",
    "reads ordinary closeness as encroachment","reciprocal unsafety","alternates between intrusion and concealment","boundary by disappearance","boundary theater","boundary maturation in progress",
    "narrative laundering","cleans harmful behavior through retelling","innocence management","reality softening","minimizes severity through diluted language","half-truth strategy",
    "reveals enough to mislead","confusion manufacturing","muddies facts when pinned down","proxy aggression","motive concealment","curated transparency",
    "reputational buffering","victim repositioning","selective memory invocation","forgets where remembering is costly","plausible misunderstanding posture","ethical compartmentalization",
    "separates misconduct from self-image","image-first remorse","private-public split","persona and conduct diverge sharply","benevolence as leverage","kindness arrives with invisible debt",
    "covert hostility","aggression kept deniable","sweet sabotage","undermines while smiling","false reconciliation","semantic escape artistry",
    "wriggles through technicalities","deniable cruelty","compliance theater","truth rationing","controls information to control choice","moral camouflage",
    "wears values as cover","selective principle use","invokes ethics only when useful","confession calibration","reversal maneuver","compassion mimicry",
    "performs empathy without embodied accountability","manipulative opacity","strategic softness","gentleness used to disarm scrutiny","relational triangulation","regulates two-person bonds through thirds",
    "secret-keeping for dominance","hoards information as currency","affective fraudulence","displays feelings not truly inhabited","integrity theater","speaks cleanly behaves opportunistically",
    "rescuer compulsion","worth tied to intervening","need-to-be-needed structure","feels secure only when indispensable","caretaking as control","self-erasing service",
    "gives at cost of self-recognition","invisible contract giving","expects return without naming it","martyr economy","suffering becomes moral claim","overfunctioning underreceiving split",
    "rescue before consent","compulsive emotional labor","manages the room automatically","fixer identity","confuses support with repair ownership","boundaryless empathy",
    "absorbs then depletes","codependent stabilization","regulates self through regulating others","resentful devotion","love curdles when not mirrored","exhaustion-blind giving",
    "notices depletion only after collapse","purpose through crisis exposure","feels alive around emergencies","care as permission to belong","helping substitutes for being","guilt-driven generosity",
    "gives to silence self-accusation","self-worth through usefulness","overattunement to need","detects others faster than self","compelled soothing","relational overresponsibility",
    "caretaking with covert claim","help arrives carrying ownership","rescue-induced dependency loops","solution-giving prevents agency","healing fantasy attachment","compassion fatigue masked as devotion",
    "self-neglect legitimized by care","emotional janitorialism","premature forgiveness pattern","pardons before impact is processed","attachment through utility","hypervigilant scanning",
    "body constantly studies for danger","freeze-dominant coping","shuts down rather than confronts","fawn adaptation","appeases threat to preserve safety","fight activation style",
    "mobilizes force quickly under threat","flight organization","energy drops out under overwhelm","body-based mistrust","calm in the body feels suspicious","startle retention",
    "system remains easy to jolt","safety nonconsolidation","threat carryover","present read through past danger","body reacts before reasoning catches up","trauma time collapse",
    "old danger feels current","attachment-triggered dysregulation","closeness activates survival states","dissociative glide","mind exits before body does","state-dependent memory",
    "predictability craving","routine sought to limit overwhelm","control as autonomic strategy","power used to settle physiology","exhausted vigilance","numbed aliveness",
    "reduced sensation mistaken for peace","relational threat coding","bracing as baseline","body lives prepared for impact","delayed discharge","reaction arrives after the event",
    "self-trust erosion by trauma","trauma-linked shame","felt safety illiteracy","panic by tenderness","overreading microshifts","tiny changes treated like warnings",
    "recovery guilt","stillness intolerance","organismic distrust","body treated as unreliable narrator","social shape-shifting","status triangulation",
    "suppresses self to preserve inclusion","peripheral self-positioning","social preemption","rejects before being excluded","clique sensitivity","popularity distrust",
    "admiration feels unstable or strategic","audience splitting","performative belonging","appears included feels unseen","relational opportunism","crowd-dependent boldness",
    "social exhaustion masking","appears fine depletes rapidly after","assimilation reflex","merges with dominant tone","outsider fixation","identity fed by not-belonging",
    "approval harvesting","collects positive reactions as fuel","prestige mimicry","belonging vigilance","monitors signs of rejection constantly","tribally moral mind",
    "ethics bend around group loyalty","social camouflage sophistication","relational scarcity bias","performance-in-public collapse-in-private split","social competence masks depletion","invisible competition stance",
    "validation-gathering behavior","curates moments for esteem extraction","alienation imprint","social overreading","belonging grief","urgency field",
    "treats life like time is always running out","frozen becoming","countdown psychology","lives toward anticipated rupture","past-possession pattern","old events dominate present meaning",
    "future siege mentality","tomorrow felt as incoming burden","process intolerance","wants result without developmental middle","repetition compulsion","nostalgic imprisonment",
    "hope deferral","temporal dysregulation","inner timing mismatched to reality","all-or-later mentality","delayed adulthood grief","mourns lost time struggles to re-enter development",
    "premature urgency identity","feels behind and overcompensates","suspended decision-making","mythic future dependency","temporal avoidance","moment noninhabitation",
    "future panic planning","memory-selective identity","curates recall to support self-story","developmental shame","latent becoming","ritualized delay",
    "turns waiting into a lifestyle","crisis-paced living","only knows how to move in emergency time","restless unfinishedness","patience deficit","slowness mistaken for failure",
    "overripe hesitation","waits past readiness","haunted timing","sacred pacing in emergence","situational integrity","conscience-led behavior",
    "image-led morality","selective accountability","self-exempting principle use","moral absolutism","compassion without boundaries","ethics detached from self-protection",
    "principled but unintegrated","believes well behaves inconsistently","conscience bypass","rationalizes what once felt wrong","ethical fatigue","performative conscience",
    "speaks morality without cost-bearing follow-through","private ethics erosion","behaves differently away from witnesses","remorse capacity intact","can feel and metabolize impact","remorse deficiency",
    "consequence understood cognitively not affectively","moves toward repair without coercion","self-purifying guilt","integrity split","public values not matched privately","justice fixation with blind spots",
    "sees others violations misses own","rule dependence","mercy deficit","selective tenderness","empathy depends on identification","moral injury residue",
    "principled resistance","can stand alone under pressure","ethical opportunism","truth loyalty","harmony-over-truth bias","suppresses reality to preserve peace",
    "ethical maturation in progress","learning accountability with complexity","desire inhibition","wants deeply asks weakly","forbidden-want pattern","ambition shame",
    "desire displacement","craving without permission","need shame","basic wanting feels embarrassing","appetitive confusion","intensity addiction",
    "struggles to receive without guilt","pleasure sabotage","interrupts enjoyment before it settles","aimlessness masking fear","desire by opposition","acquisitive soothing",
    "accumulates to fill psychic lack","unchosen life drift","appetite buried under adaptation","motivational fragmentation","many wants no hierarchy","self-disqualifying aspiration",
    "desire present self deemed unfit","eroticization of impossibility","consumption as anesthesia","appetite used to dull affect","starvation idealization","mistakes deprivation for purity",
    "wanting without organizing","desire not translated into structure","reward mistrust","pleasure as threat to control","good feeling seems dangerous","ascetic compensation",
    "greed as emptiness management","longing identity","drive collapse after attainment","quest energizes more than having","purpose hunger","intellectualization",
    "rationalization","retrofits reasons onto driven behavior","projection","locates disowned material in others","reaction formation","displacement",
    "dissociation","exits presence to reduce overwhelm","denial","minimization","shrinks scale to reduce consequence","idealization",
    "devaluation","humor as defense","turns pain sideways into wit","sarcasm armor","protects vulnerability through edge","fantasy compensation",
    "lives partly in imagined resolution","regression","undoing","splitting","cannot hold mixed qualities together","identification with aggressor",
    "sublimation","anticipatory defense","counterphobic posturing","obsessive control defense","overorganizes to prevent affect spill","moralization",
    "converts discomfort into principle","aestheticization","pseudoacceptance","calls resignation peace","insight without surrender","understands defense still serves it",
    "defense fatigue","jaw-held anger","tension stored where words stop","chest-collapse shame","body caves under self-condemnation","forward-leaning vigilance",
    "startle carriage","body posture carries history","shallow-breath control","restricts breath to restrict feeling","frozen facial affect","expression minimized to preserve safety",
    "busy hands braced body","activation searching for discharge","hard gaze defense","eyes used to repel closeness","soft eyes guarded torso split","warmth present body unconvinced",
    "voice constriction under truth","collapse in spine under authority","body remembers hierarchy as danger","restless pacing mind","movement tries to manage overflow","stillness as freeze not peace",
    "oversmiling compensation","face performs ease body does not feel","minimal appetite under stress","survival state suppresses hunger","body recruits external anchors","tremor after composure",
    "discharge arrives once performance ends","numb body loud mind","cognition compensates for disembodiment","protective shrinking","body reduces visibility","expansion anxiety",
    "taking up space feels risky","fatigue from vigilance","body taxed by chronic scanning","breath return in safety","destabilizes when care becomes believable","safety itself becomes activating",
    "usefulness substitutes for worth","selection mistaken for value","articulation replaces action","preserves innocence through ambiguity","vagueness protects self-image","reads threat into silence and delay",
    "absence quickly becomes danger","withdrawal used as consequence","performs strength conceals fragility","hardness covering vulnerability","seeks reassurance cannot metabolize it","soothing sought then rejected",
    "craves closeness fears dependence","desire split by threat","turns shame into accusation","exposure becomes suspicion or blame","covert contracts become bitterness","calm love feels unfamiliar",
    "mistakes chaos for aliveness","treats tenderness like exposure","softness read as risk","uses confusion to evade consequence","murkiness becomes strategy","overfunctions to avoid being left",
    "performance used to secure attachment","helplessness protects against failure","feels safest while braced","relaxation feels unsafe","needs admiration to outpace inadequacy","esteem used to outrun shame",
    "self-minimizing to preempt rejection","finds identity in opposition","resistance used for self-definition","loves through service not receptivity","giving replaces receiving","uses silence to force psychic pursuit",
    "absence made into leverage","is chronically preparing for rupture","bond held under threat expectation","anxiety mistaken for knowing","language outruns embodiment","wants absolution more than accountability",
    "relief preferred over repair","organizes life around anticipated disappointment","expectation shaped by future hurt","protects dignity by refusing need","self-protection through nondependence","turns longing into suspicion",
    "desire becomes distrust","pain remains central organizer","experiences boundaries as rejection first","limits interpreted as abandonment","easy goodness feels unreal","needs visibility fears exposure",
    "familiarity wins over growth","peace disrupts identity organization","disorganization rebranded as truth","still confuses familiarity with safety","past threat shapes present perception","insight precedes capacity",
    "reality gaining priority","eroticized distance","eroticized danger","eroticized rejection","wants most what stays withholding","eroticized powerlessness",
    "eroticized control","eroticized being-chosen","eroticized rescue","eroticized instability","chemistry strongest inside volatility","eroticized secrecy",
    "hiddenness heightens charge","eroticized shame","eroticized admiration","eroticized inaccessibility","eroticized idealization","eroticized pursuit",
    "interest drops once reciprocation stabilizes","eroticized conquest","eroticized repair","eroticized submission to certainty","eroticized chaos regulation","eroticized annihilation fantasy",
    "eroticized devotion","eroticized humiliation","eroticized validation","eroticized novelty dependence","newness required to sustain charge","eroticized emotional deprivation",
    "eroticized objectification","eroticized worship","eroticized possession","eroticized grief","eroticized self-forgetting","eroticized being-needed",
    "feels most desired when indispensable","eroticized being-seen","eroticized risk of abandonment","eroticized withholding","power retained through delayed access","eroticized emotional asymmetry",
    "eroticized danger-to-softness sequence","eroticized attention capture","eroticized dominance as anti-shame","control covers vulnerability","eroticized yielding as relief","eroticized emotional transgression",
    "wants what violates conscious self-image","eroticized exclusivity","eroticized fusion fantasy","eroticized restraint","eroticized volatility bond","eroticized melancholy",
    "eroticized performance anxiety","eroticized invisibility relief","eroticized maternal hunger","eroticized paternal hunger","eroticized punishment","eroticized admiration harvesting",
    "eroticized self-abandonment","eroticized scarcity loop","eroticized degradation-repair cycle","eroticized audience effect","eroticized secrecy container","eroticized forbidden self",
    "reciprocity reduces erotic tension","desirability mistaken for worth","uses seduction to regulate worth","erotic pull becomes self-esteem management","fusion compensates for weak self-cohesion","aroused by what withholds",
    "scarcity intensifies desire","needs admiration to access desire","being adored unlocks erotic charge","most activated by uncertainty","ambiguity heightens charge","calm feels flatter than pursuit",
    "arousal covers sorrow","turns longing into chemistry","ache gets sexualized","mistakes intensity for compatibility","charge mistaken for fit","protects heart by eroticizing distance",
    "exclusivity organizes desire","reverence excites steadiness challenges","direct fabrication","selective omission","curated truth-telling","semantic evasion",
    "hides behind technically correct wording","plausible misunderstanding","false precision","adds detail to simulate honesty","confabulatory smoothing","strategic vagueness",
    "half-confession pattern","retroactive reframing","intentionality minimization","memory opportunism","remembers selectively according to pressure","affective misdirection",
    "moral deflection","question-answer slippage","answers a nearby question not the actual one","overexplained innocence","underexplained concealment","charm-assisted untruth",
    "warmth used to lower scrutiny","indignation defense","acts offended to reverse pressure","false transparency theater","proxy truthing","controlled disclosure",
    "relational truth rationing","image-sparing distortion","benevolent deceit posture","victim repositioning lie-style","exhaustion-based evasion","contradiction normalization",
    "technical innocence dependence","false forgetting","defensive irrelevance flooding","incremental revelation","reactive honesty only","identity-protective deceit",
    "future-faking as deception","motive denial reflex","soft-gaslighting style","tone-substitution defense","benignity inflation","elastic accountability",
    "confession without correction","admits but changes nothing structurally","truth delayed past usefulness","sincerity mimicry","sounds authentic without embodied congruence","borrowed language honesty",
    "accuracy avoidance by abstraction","stays conceptual to avoid specifics","deniability preservation instinct","always leaves an exit route","self-deceiving narrative repair","protective splitting of truth",
    "keeps incompatible realities separated","virtue-shield deception","high-verbal concealment","uses language itself as smoke","shame-driven lying","predatory lying",
    "protects image through selective truth","preserves appearance over accuracy","omission carries the deception","uses detail to fake credibility","precision simulates honesty","answers around the question",
    "evasion replaces direct answer","confesses only after options narrow","truth comes when control shrinks","needs innocence more than accuracy","blamelessness outranks truth","edits narrative under pressure",
    "story changes when exposed","uses offense to avoid disclosure","indignation blocks inquiry","murk protects motive","self-deception stabilizes the lie","promises later to escape now",
    "future talk avoids present consequence","honesty is reactive not principled","always preserves deniability","overstillness under threat","body freezes to contain overwhelm","excessive animation compensation",
    "movement increases to outrun discomfort","eye-contact volatility","hard stare defense","soft-face tense-body split","jaw locking","anger or restraint held somatically",
    "lip compression","mouth asymmetry contempt trace","chin lift defensiveness","shoulder rise vigilance","body prepared for impact","collapsed sternum shame posture",
    "chest caves as self-protection","protective torso angling","body turns partially away under discomfort","body points toward preferred exit or interest","hands hidden under pressure","visible expression reduces when threatened",
    "neck touching self-soothing","contact used to regulate vulnerability","face touching under scrutiny","stress signal not automatic deceit","breath restriction","holds breath to hold affect",
    "speech-breath mismatch","talks while physiologically braced","frozen smile","social signal present joy absent","overbright smile compensation","charm placed over strain",
    "mind checks safety before answering","rapid nodding appeasement","body works to maintain a nonthreatening field","head tilt attunement bid","invites softness or connection","head retraction aversion",
    "self-containment posture","limbs stay close reduced expansion","restless leg discharge","energy searching for outlet","pacing under affect","movement used to metabolize activation",
    "stillness as dominance","motionlessness creates power or opacity","overleaning intensity","divided attention under insecurity","object fidget reliance","voice drop under truth",
    "authentic material deepens or slows the voice","voice brightening under concealment","performative lightness covers tension","sudden flattening of face","shutdown or dissociation entering","blink-rate changes under strain",
    "eye rhythm shifts with arousal","delayed laughter","uneven smile-to-eye congruence","tension smile after conflict","peacekeeping expression over unresolved activation","protective crossing of limbs",
    "body closes for containment or defense","hand wringing or finger picking","self-soothing under anxiety","torso openness with foot withdrawal","body goes small when needs emerge","desire linked with exposure",
    "body goes rigid in tenderness","softness not yet fully safe","postural inflation after shame","microsigh after answer","body releases what words concealed","delayed slump after performance",
    "composure held until safety returns","overlaughing at small remarks","affiliative strategy under uncertainty","still eyes active mouth split","head down eyes up dynamic","deference mixed with vigilance",
    "strong handshake collapsed shoulders split","curated confidence over depleted base","feet planted gaze fragmented","body wants steadiness mind remains unsettled","body braces before words do","physiology reacts ahead of speech",
    "warm face guarded torso","expression welcomes body stays defended","needs to look calm more than feel calm","appearance prioritized over regulation","anger lives in the jaw","tension holds unsaid aggression",
    "softness rises body resists it","wants contact keeps an exit","uses stillness to regain power","motionlessness becomes control","performs ease over activation","composure covers arousal",
    "contraction replaces assertion","eyes ask posture retreats","leaves the body before leaving the room","dissociation precedes exit","body says no faster than mouth does","physiology refuses before language does",
    "physiology contradicts narrative","body cues conflict with stated story","calms only after control returns","regulation depends on restored dominance","still smiling no longer open","past threat lives in stance",
    "spiritualized avoidance","premature forgiveness posture","love-and-light defense","positivity exiles darker truth","karmic rationalization","destiny laundering",
    "lesson inflation","vibration superiority","ascension narcissism","energetic blame-shifting","intuition-infallibility posture","spiritual grandiosity",
    "special mission identity covering inadequacy","guru hunger","channeling authority dependence","hex paranoia drift","ordinary conflict becomes magical persecution","shadow-work romanticization",
    "wound-as-gift inflation","cosmic exceptionalism","embodiment avoidance via theory","talks energy avoids body","esoteric compensation","nondual bypass",
    "forgiveness coercion","sacralized confusion","aesthetic spirituality","curates sacred image without groundedness","prayer-as-avoidance","ceremonial displacement",
    "purity obsession in sacred clothing","discernment collapse into projection","personal fear labeled spiritual download","chosen-one exhaustion","specialness fantasy becomes burden identity","oracular overconfidence",
    "impressions trusted beyond adequate testing","frequency moralism","alchemical language without actual metabolization","ancestral language as shield","trauma mystification","ceremonial control",
    "divine timing passivity","compassion bypass","shadow inflation","sacred exceptional suffering","energetic boundary fantasy","detachment distortion",
    "emotional withdrawal called enlightenment","intuition contaminated by wish","deepest desire disguised as message","mystical certainty against evidence","inner revelation outranks clear reality","sacred identity fragility",
    "worldview challenge felt as desecration","frequency policing","disagreement dismissed as misalignment","spiritualized non-accountability","devotional self-erasure","mistakes self-loss for surrender",
    "sacred rescue fantasy","believes love or light alone will redeem what needs boundary and consequence","channel-versus-check split","trusts downloads more than outcomes","esoteric dependency","numinous overinterpretation",
    "significance detected everywhere discernment lagging","uses transcendence to avoid contact","spirituality replaces embodied encounter","meaning outruns mourning","needs mystery more than accuracy","obscurity preferred over grounded truth",
    "mistakes projection for intuition","calls withdrawal detachment","distance renamed enlightenment","inflates wounds into spiritual rank","suffering becomes prestige","symbolism substitutes for authorship",
    "spiritual vocabulary covers concrete issues","treats forgiveness like erasure","absolution bypasses impact","feels chosen when feeling powerless","specialness compensates for helplessness","metaphysics outruns mourning",
    "needs higher narrative to hold shame","grand frame contains defectiveness","romanticizes shadow resists accountability","darkness embraced more than integrated","trusts symbolism faster than evidence","signs outrun facts",
    "speaks energy avoids behavior","abstraction replaces action","mysticism substitutes for limit-setting","seductive helplessness","relational sorcery pattern","beauty-as-power dependence",
    "soft control","eroticized self-objectification","wombed resentment","maternal engulfment","attachment through suffering","mirror hunger",
    "receiver entitlement","weaponized tenderness","vulnerability used to disarm accountability","jealous enchantment","indirect rivalry","priestess inflation",
    "mystique dependence","opacity cultivated to preserve allure","emotional weather control","room organized around personal state without direct request","devotional extraction","invites loyalty while offering ambiguity",
    "victim-queen duality","receptivity as test","lunar volatility","erotic withholding as power","sororal betrayal wound","nurturance without boundaries",
    "overmothers then resents depletion","sacred feminine inflation","honeyed contempt","sweetness carrying quiet diminishment","beauty grief","selection obsession",
    "intensity-as-depth belief","rejection alchemy into glamour","dark feminine compensation","weaponized unreadability","need denial through allure","feral tenderness split",
    "softness present trust absent","mother wound reenactment","self-erasure through devotion","hyperreceptive boundarylessness","primal desirability anxiety","sorrow-glamor fusion",
    "pain woven into beauty identity","receives attention distrusts its sincerity","admiration does not fully land","competes by indirection not declaration","rivalry stays covert","needs to feel unforgettable",
    "memorability organizes worth","tenderness used instead of clarity","turns hurt into atmosphere","wants devotion without clear terms","loyalty desired without explicit agreement","attraction confused with emotional safety",
    "protects need with mystery","opacity covers dependency","indirectness replaces direct request","uses unreadability as power","ambiguity sustains influence","feels chosen or erased",
    "selection determines selfhood","soft outside armed inside","gentleness covers defense","buries anger beneath grace","resentment hidden under composure","makes beauty carry self-worth it cannot safely hold",
    "desirability overloaded with identity needs","armored competency","power-seeking covers inner helplessness","emotional austerity","tenderness shame","protector inflation",
    "provider identity collapse","self-worth crashes when materially ineffective","instrumental relating","control through certainty","speaks definitively to avoid vulnerability","authority addiction",
    "needs respect to regulate selfhood","rage as permitted sadness","possession-coded love","stoic dissociation","humiliation intolerance","performance masculinity",
    "dominant posture dependent core split","acts autonomous while inwardly attachment-hungry","rescue entitlement","sex-as-worth regulation","desirability or conquest stabilizes self-esteem","emotional illiteracy with moral pride",
    "competence tyranny","injury-to-control conversion","pain answered with tightened command","mentorship inflation","enjoys instructing more than mutuality","withholding as sovereignty",
    "distance mistaken for power","conflict as hierarchy","vulnerability bargaining","savior complex with resentment","gives then feels used","father wound reenactment",
    "shame masked by swagger","bravado protects defectiveness","displaced animus","projects disowned aggression onto others","initiation deficit compensation","intimacy incompetence hidden by charisma",
    "social fluency exceeds relational depth","mission over mutuality","goals outrank emotional responsibility","need disdain","collapse after failure","predatory calm",
    "tenderness panic","provider martyrdom","confidence covers vulnerability","softness feels dangerous","numb control mistaken for wholeness","dignity precedes softness",
    "becomes useful instead of vulnerable","confuses leadership with domination","guidance collapses into control","calls distance strength","withdrawal framed as power","turns shame into hardness",
    "humiliation converted into rigidity","asks for little resents much","strength identity blocks rest","provision substitutes for intimacy","protects weakness by mocking it","contempt guards vulnerability",
    "handles crisis better than closeness","emergency feels safer than intimacy","invulnerability equated with safety",
  
    "no way back from this","already crossed","the return closed","once said it changed","the door sealed","after that nothing held",
    "crossed and kept moving","the break was clean","already on the other side","let it close","said and done","the line moved",
    "stepped over and stayed","past the point of undoing","the version that waited ended","turned and didn't look back","what was done was done","that one couldn't be taken back",
    "the before was gone","sealed it without ceremony","moved and didn't explain","the threshold passed","couldn't unknow it","left that version behind",
    "the shift was permanent","nothing to return to","already somewhere else","the change held","moved past the repairable","the original was gone",
    "broke without breaking down","ended before the ending","the distance became fixed","released and didn't retrieve","stepped outside and stayed","the old arrangement dissolved",
    "past where apology reaches","the habit outlived itself","the pattern ended mid-step","something settled into place","chose and the choice held","what closed didn't reopen",
    "moved before being ready","the turn was complete","already past the asking","let it finish itself","the door was already closed","the known became the former",
    "nothing restored itself","the before and after split","the door didn't budge","gone and didn't look","the break was final","no thread back",
    "past fixing","the old self dropped","no way through","the line held","already past","nothing reclaimed",
    "the cut was clean","closed without sound","the turn stayed turned","no second door","stepped and meant it","the behind disappeared",
    "no retrieval","the cord severed","after no before","the ending took","nothing called","sealed by silence",
    "the past went foreign","no loose ends","crossed without ceremony","the gap fixed itself","no backwards pull","already elsewhere",
    "the stop held fast","no undoing","the shift locked in","the earlier shape dissolved","no reclamation","the gate not guarded just gone",
    "what ended stayed ended","moved and didn't measure","already divided","the threshold disappeared","no reverse","the change absolute",
    "the old story finished","no echo back","the severance quiet","finished without sound","nothing to resume","the prior self unreachable",
    "let it and it held","no path backward","settled into gone","no resurrection","the break laid still","no backtrack",
    "the seam vanished","already something else","no former claim","the distance became distance","locked without key","no unwinding",
    "cut without gesture","and stayed cut","no more return","ended so it was",
    "has hidden variables","many hidden variables","few known variables","has many friends","has a few friends","has no friends",
    "has a lot of friends","is friendly often","is unfriendly often","is mean often","is nice often","is kind often",
    "has kind friends","has mean friends","lies a lot often","lies sometimes","never lies","never lies to friends",
    "often lies to friends","pretends to be friendly","pretends to be enemies","has many enemies","has few enemies","hates on people",
    "rarely hates on people","jumps the gun","learns quickly often","adaptive and quick","often betrays allies","often betrays friends",
    "does not believe in evil","does not believe in good","always on the fence","loves to fight","loves to argue","subtle manipulator",
    "good manipulator","excellent manipulator","expert manipulator","master manipulator","worst manipulator","very bad manipulator",
    "very good manipulator",
    "talks heavy","barely says nothing","all cap","no cap on the dead homies","stay wit the shits","be on go",
    "be on timing","type valid","valid crashout","worth the crashout","not worth the crashout","been through it",
    "been like that","pressed for no reason","mad pressed","always extra","doin the absolute most","doin the least",
    "be on nat nat","be on gang","whole gang solid","whole gang fake","got opps for days","got no opps",
    "runs from the smoke","runs to the smoke","really like that","not really like that","just talkin hot","bout that action",
    "frontin heavy","too comfortable","know their place","dont know their place","sneaky link type","side piece mentality",
    "fumbled the bag","got the bag right","moving mad","moving smart","moving dirty","moving clean",
    "loud and wrong","quiet and right","killed the vibe","too available","handles business","leaves business messy",
    "sweats the opps","ignores the opps","has receipts","burnt the receipts","keeps the circle small","circle full of randoms",
    "moves like a boss","moves like a worker","participation trophy","talks in code","talks too reckless","know when to be quiet",
    "never knows when to be quiet","got hidden layers","an open book","straight shooter","sideways hater","lowkey a snake",
    "highkey a rider","builds you up","tears you down slow","plays the long game","wants it now","patience on a hundred",
    "no patience at all","always schemin","never plottin","move in silence","need attention bad","keeps the peace",
    "starts the chaos","folded under pressure","held it down","let it crumble","really outside","chronically online",
    "lies often to others",
    "rarely lies to others","often lies to family","lies to everyone","lies to no one","lies only to strangers","lies only to close ones",
    "lies when afraid","lies when cornered","lies to protect themselves","lies to protect others","lies without knowing it","lies and believes it",
    "lies then forgets","lies then confesses","lies by omission always","lies by omission sometimes","never lies by omission","comfortable lying",
    "uncomfortable lying","lies under pressure","honest under pressure","lies for convenience","lies for survival","lies for attention",
    "lies out of habit","lies out of fear","lies out of love","lies out of cruelty","lies to feel safe","lies to feel powerful",
    "stops lying eventually","never stops lying","lies less over time","lies more over time","honest to others","honest to friends",
    "honest to family","honest with strangers","honest with themselves","rarely honest with themselves","honest only when asked","honest without being asked",
    "brutally honest","selectively honest","strategically honest","partially honest always","honest at the wrong moment","honest at the right moment",
    "honest to a fault","too honest for their own good","honest but unkind","honest and kind","honest and cold","honest and warm",
    "honest when it costs nothing","honest when it costs everything","honesty is their weapon","honesty is their armor","honesty comes late","honesty comes easily",
    "honesty comes hard","grew into honesty","grew out of honesty","teaches honesty poorly","models honesty well","has moral ethics",
    "has immoral ethics","has no fixed ethics","has situational ethics","has flexible ethics","has rigid ethics","ethics shift with audience",
    "ethics shift under pressure","ethics are performative","ethics are genuine","ethics are inherited","ethics are self invented","questions their own ethics",
    "never questions ethics","lost their ethics slowly","found their ethics late","ethics intact under pressure","ethics collapse under pressure","holds ethics privately",
    "performs ethics publicly","private ethics match public","private ethics differ publicly","steals from others often","never steals from others","steals occasionally",
    "steals only when desperate","steals without guilt","steals with guilt","steals and returns it","steals ideas","steals credit",
    "steals time","steals energy","steals attention","steals from the vulnerable","steals from the powerful","never takes what is not theirs",
    "takes more than their share","takes less than they deserve","takes without asking","asks before taking","gives back what was taken","keeps their word",
    "rarely keeps their word","breaks promises cleanly","breaks promises quietly","owns their mistakes","hides their mistakes","apologizes and means it",
    "apologizes and repeats it","never apologizes","apologizes for everything","takes responsibility","deflects responsibility","admits fault privately",
    "admits fault publicly","blames others first","blames themselves first","holds others accountable","holds no one accountable","holds themselves accountable",
    "excuses themselves always",]],
  ["identity", "identity", [
    "clear articulation","technical literacy","information control","harm awareness","domain mastery","temporal awareness",
    "deep passion","easily bored","drawn to the unseen","concise expression","system navigation","selective disclosure",
    "dose precision","precision calibration","genuine affection","slow to engage","sensitive to energy shifts","rapid comprehension",
    "active listening","rapid troubleshooting","compartmentalization","tolerance tracking","advanced synthesis","schedule adherence",
    "strong attachment","quick loss of interest","finds symbolic meaning in events","audience awareness","code comprehension","operational silence",
    "risk assessment","high resolution analysis","pacing control","personal affinity","restless mind","interprets signs instinctively",
    "efficient problem solving","contextual framing","efficient debugging","need to know filtering","interaction awareness","multi variable modeling",
    "timing precision","emotional investment","short attention span","self defined individual","role based persona","externally validated identity",
    "internally constructed self","adaptive social mask","fixed character profile","fluid self concept","layered personality structure","public facing identity",
    "private inner self","inherited identity frame","self authored narrative","situational identity shift","core identity anchor","fragmented self image",
    "integrated identity model","projected persona construct","perceived social role","unresolved identity state","emergent self pattern","identity holder",
    "decision maker","internal observer","self regulator","inner narrator","creative artist","meaning interpreter",
    "silent observer","manipulator","pattern avoider","self sabotaging agent","identity masker","self corrected action",
    "self defeating behavior","self doubt","self defeating thoughts","role ambiguity","role instability","role hierarchy",
    "role structure","role arrangement","self directed individual","self directed operator","self regulated role","value aligned identity",
    "value creator identity","dependent behavior","disconnected identity","externalized responsibility","externally controlled role","identity confusion",
    "low agency identity","misaligned identity","victim mindset","assigned identity","role based identity","situational identity",
    "identity masking","personal obsession","identity alignment","personal calling","avoids vulnerability","values hidden knowledge",
    "seeks deeper layers","self aligned pursuit","personal sanctuary","self reinforcing habit","comfortable with duality","avoids draining inputs",
    "avoids confrontation","drawn to mystery","prefers the unknown","self reliant","values autonomy","prefers control",
    "avoids discomfort","seeks ease","low resistance tolerance","identity partitioning","role shifting","persona layering",
    "self observation","identity anchoring","self direction","athletic build","skinny frame","wide set frame",
    "lean physique","seeks definition","seeks alignment","seeks tolerance","seeks development","self referential logic",
    "identity misuse","identity spoofing","character labeling","high tolerance step","self absorbed","personal storyteller",
    "high tolerance for pressure","low resistance to stress","sharp facial features","soft rounded features","defined jawline structure","subtle jawline contour",
    "weathered skin surface","steady direct gaze","wandering unfocused gaze","upright balanced posture","slouched uneven posture","lean body composition",
    "stocky body build","tall vertical presence","compact physical stature","symmetrical facial balance","asymmetrical facial structure","well groomed appearance",
    "avoids disclosure of plans","strong preference for structure","seeks clear predictable outcomes","comfortable with uncertainty","prefers minimal social interaction","thrives in group environments",
    "leans toward independent work","prefers guided instruction","values speed over precision","prioritizes accuracy over speed","drawn to high intensity situations","prefers detailed planning processes",
    "operates with spontaneous decisions","seeks consistent daily routines","adapts to variable schedules","prefers direct communication style","avoids confrontation when possible","values privacy over transparency",
    "leans toward open disclosure","constraint navigating thinker","moderate change","moderate pace","moderate variation","centered mind",
    "controlled attention","controlled emotion","inner clarity","integrated cognition","integrated thinking","open awareness",
    "resilient thinking","unified cognition","unified focus","centered awareness","inner steadiness","unified attention",
    "whole mind state","fragmented attention","inner turbulence","moderate awareness","open processing","passive awareness",
    "passive thinking","light focus","moderate focus","open attention","soft focus","surface thinking",
    "integrated leadership model","integrated leadership system","transparent authority model","transparent authority system","broken chain of command","control imbalance",
    "control without accountability","fragmented leadership","hidden power structure","inconsistent authority","opaque hierarchy","power concentration",
    "power imbalance","empty leadership role","opaque command flow","power hoarding","control model","power distribution",
    "power structure","control arrangement","controlled throughput","inconsistent output","skill degradation","moderate efficiency",
    "moderate output rate","needs constant stimulation","inner drive","quick to anger","hardware familiarity","resourceful thinking",
    "hard to read","robust design","software evaluation","complexity reduction","authentic enjoyment","needs control",
    "confident delivery","controlled exposure","fragmented knowledge","controlled access tiers","constraint navigation","needs feedback",
    "hard to let go","needs stability","controlled transparency","reality filtering","constraint bending","complexity folding",
    "power balancing","autonomy reinforcement","inner coherence","needs clarity","needs focus","needs patience",
    "needs work","lightweight structure","dark leaning intent","needs specification","needs structure","needs endurance",
    "needs improvement","inner guided reader","constraint aware reasoning","quick to synthesize","hidden liability","hidden encumbrance",
    "hidden attraction elsewhere","private admiration fixation","hidden expectations","passive exit planning","hidden debt","private subscriptions",
    "control through silence","resource gatekeeping","realigned window step","needs of","masks truth with ambiguity","controls narrative exposure",
    "masks origin of resources","skill intensive role","false authority figure","status manipulation","status level","status arrangement",
    "attracted to ritual","prone to irritation","highly sensitive","honest self assessment","attracted to transformation","comfortable alone",
    "status positioning","very secretive","always late","rarely friendly","very cleanly","very messy",
    "often evil","highly guarded","requires restraint","instinctive diviner","deceptive practice","blind in one eye",
    "has sex often","rarely has sex","has a lip ring","tool proficiency","natural attraction","core interest",
    "morning irritability","moves by inner knowing","intrinsic motivation","guided by subtle cues","operates on instinct","technical fluency",
    "easily frustrated","sleep regulation","enduring interest","charges actions with intent","uses structure for meaning","favorite domain",
    "beloved activity","comfort pursuit","chooses phrasing deliberately","dedicated interest","natural inclination","easily overwhelmed",
    "questions surface reality","explores esoteric systems","signature interest","studies symbolic frameworks","digital adaptability","preferred environment",
    "core attachment","source of fulfillment","uses imagination as tool","visualizes outcomes","purpose alignment","dislikes uncertainty",
    "builds inner scenarios","resists change","people aware","accepts paradox","sees both sides","energy sensitive",
    "picks up on tone","reinvents identity","craves validation","embraces change","responds to praise","withdraws under stress",
    "shuts down emotionally","goes silent","maintains boundaries","retreats inward","emotion driven","explores hidden paths",
    "resists definition","operates outside norms","energy fluctuates","creates meaning","loyal to a fault","assigns significance",
    "links events symbolically","constructs inner systems","stays through conflict","uses solitude productively","reflects deeply","builds inner world",
    "comfort driven","locks in deeply","uses people","useful in labor","magic user","kind a lot",
    "sees auras","natural oracle","chronically delayed","immaculate habits","manual task capable","ritual practitioner",
    "morally ambiguous","perceptive to subtle fields","heavy upper frame","physically dependable","symbolic operator","energetically perceptive",
    "misses deadlines","clock aligned","sport trained body","thick torso build","slender composition","sterile environment keeper",
    "clutter prone","workhorse capacity","arcane practitioner","shadow oriented","habitually kind","reduced capacity",
    "responsible actor","wants for","possessions accumulated","intents for","gives gifts","gets gifted",
    "does math well","has earrings","argues a lot","bodily features","right moment","wrong moment",
    "frequent abandonment of plans","difficulty expressing intent","shares selectively when necessary","maintains layered narratives","parent figure","authority parent",
    "nurturing parent","strict disciplinarian","protective guardian","supportive partner","dominant partner","dependent partner",
    "conflicted partner","older sibling leader","younger sibling dependent","protective sibling","competitive sibling","absent sibling",
    "primary caregiver","secondary caregiver","emotional caretaker","financial provider","household manager","family mediator",
    "conflict initiator","peace keeper","boundary setter","responsible child","rebellious child","overlooked child",
    "favored child","burdened child","role model figure","black sheep member","scapegoated member","golden child role",
    "invisible member","elder advisor","family historian","tradition keeper","legacy builder","end of line carrier",
    "mother","father","parent","stepmother","stepfather","son",
    "daughter","child","stepchild","brother","sister","sibling",
    "half brother","half sister","grandmother","grandfather","grandparent","grandson",
    "granddaughter","grandchild","aunt","uncle","niece","nephew",
    "cousin","spouse","husband","wife","partner","mother in law",
    "father in law","parent in law","brother in law","sister in law","son in law","daughter in law",
    "guardian","ward","income generator","resource allocator","risk evaluator","problem resolver",
    "stability maintainer","romantic partner","loyal friend","family member","active caregiver","emotional dependent",
    "group leader","active follower","conflict mediator","direct competitor","trusted ally","continuous learner",
    "practical teacher","curious explorer","system creator","long term strategist","forward planner","task organizer",
    "rule enforcer","working employee","employer","active student","paying customer","asset owner",
    "unknown stranger","aligned decision flow","misaligned goals","corrupted judgment","primary focus","aligned mindset",
    "misaligned thinking","neutral awareness","neutral cognition","accountable leadership layer","aligned authority system","aligned command structure",
    "distributed authority model","distributed authority system","legitimate authority","accountable command flow","aligned reporting system","authority confusion",
    "authority instability","authoritarian control","centralized bottleneck","command breakdown","corrupt leadership","hierarchy breakdown",
    "hierarchy dysfunction","leadership instability","leadership vacuum","misaligned hierarchy","unstable authority system","accountability gap",
    "authority distortion","command confusion","hierarchical congestion","authority distribution","authority framework","authority level",
    "chain of command","command framework","command layer","command structure","hierarchical arrangement","hierarchical model",
    "hierarchy structure","leadership tier","management structure","organizational hierarchy","organizational layout","organizational model",
    "organizational tier","authority map","command arrangement","leadership map","management layer","oversight model",
    "accountable operator","autonomous identity","independent thinker","primary passion","lead time planning","independent judgment",
    "gatekeeper navigation","support network use","command line fluency","gatekeeper leverage","independent by default","alliance mapping",
    "authority assertion without consent","alliance building behind the scenes","support withholding","lead time activation","partnership formed","support received",
    "independent contractor role","team dependent position","supervisory level role","capable management layer","competent leadership","defined leadership structure",
    "experienced leadership tier","merit based ranking","responsive leadership model","credible leadership core","defined reporting chain","principled leadership tier",
    "dominated structure","oppressive system","top heavy structure","bloated management layer","credibility vacuum","territorial leadership",
    "top down dysfunction","vacant oversight layer","position level","ranked structure","tiered system","vertical organization",
    "position structure","rank framework","responsibility layer","tier model","vertical framework","client facing position",
    "field based assignment","office based assignment","sedentary desk work","specialized technical role","watching without acting","present but absent",
    "seeing clearly now","chose not to look","looked away once","remembers everything","forgot on purpose","witnessed the moment",
    "overlooked the detail","noticed too late","saw it coming","did not want to see","refused to acknowledge","observed from distance",
    "present at the scene","absent at the moment","kept record of","bore witness to","testified to nothing","saw and said nothing",
    "watched it happen","present without presence","invisible observer","silent recorder","the one who stayed","the one who left",
    "the one who watched","the one who spoke","the one who kept quiet","the one who came back","the one who never returned","the one who knew first",
    "the one who knew last","the one who caused it","the one who fixed it","the one who walked away","the one who arrived late","the first to fall",
    "the last to leave","the one left standing","the one who started it","the one who ended it","the one who carried it","the one who dropped it",
    "the witness at the door","the keeper of the flame","the one who built the wall","the bridge between","the gap between","the space between",
    "the point of no return","the moment before","the moment after","the edge of knowing","the first betrayal","the moment of recognition",
    "the second look","the point of contact","the moment of separation","the return of the familiar","the arrival of the unknown","the departure from safety",
    "the sealing of the door","the opening of the path","the closing of the window","the turning of the tide","the shifting of the ground","the breaking of the pattern",
    "the restoration of order","the dissolution of form","the emergence of structure","the weight of it","the pull toward","the push against",
    "the hold on","the release of","the return to","the distance from","the pressure of","the absence of",
    "the presence of","the cost of knowing","the price of silence","the weight of memory","the burden of proof","the gift of doubt",
    "the curse of certainty","the freedom of unknowing","the trap of clarity","the mercy of forgetting","the danger of remembering","knows what they did",
    "knows who they are","knows what they want","knows what they lost","knows they were wrong","knows it was a mistake","knows and pretends not to",
    "knows and cannot say","sure but quiet","unsure but loud","certain and wrong","uncertain but right","clear without proof",
    "clouded despite evidence","knows without knowing how","cannot unknow this","cagey disclosure","confessional luring","hidden motive",
    "controlled revelation","privacy as self preservation","partial honesty","delayed honesty","disclosure anxiety","revelation compulsion",
    "open quickly then panic","chronic guardedness","curated weakness","emotional flooding after disclosure","only vulnerable when advantaged","delayed truth after resentment",
    "silence under scrutiny","confesses in crisis","black sheep role","role inversion","rescuer becomes controller","victim becomes aggressor",
    "peacemaker becomes saboteur","helper becomes resentful punisher","strong one collapses helplessly","avoidant becomes pursuer under threat","pursuer becomes cold withdrawer","innocent persona flips accusatory",
    "stoic persona flips explosive","nurturer flips engulfing","nihilistic lean","responsibility oriented stance","avoidance of freedom","dread of purposelessness",
    "chosen one worldview","absurdist contact","cosmic belonging","exile consciousness","existential apologetics","reality interpretation",
    "evidence based reading","threat based reading","symbolic reading","persecutory reading","scarcity reading","moralized reading",
    "romanticized reading","cynical reading","sacred reading","trauma filtered reading","self referential reading","control framed interpretation",
    "possibility framed interpretation","nostalgia pull","all or later mentality","crisis paced time","sacred pacing","temporal detachment",
    "memory weighted identity","anticipation states","dread","vigilance","hope","preemptive grief",
    "rescue fantasy","catastrophe rehearsal","disappointment expectation","reunion fantasy","bracing","scanning",
    "impulsive preparation","certainty seeking","relief fantasy","anticipatory suffering","hyperplanning","grief states",
    "frozen grief","ambient grief","displaced mourning","compartmentalized bereavement","stoic grief posture","anger coated grief",
    "belated grieving","identity grief","unmourned future","phantom attachment","grief guilt","invisible grief",
    "anticipatory grief","devotional bereavement","body kept sorrow","unfinished goodbye","survivor shame","desire architecture",
    "forbidden want","deprivation hunger","eroticized scarcity","attachment to longing","eroticized being chosen","self abandoning desire",
    "personal identity","rigid self concept","overidentification with role","label dependence","unstable self definition","weak core continuity",
    "ego dissolution","softened self boundaries","diminished separateness","unity seeking","loss of fixed i","anonymity seeking",
    "desire to go unseen","erase footprint","avoid recognition","retreat from personhood","depersonalization traits","self unreality",
    "estranged from own thoughts and body","no stable social function","detachment from titles","existential drift","non positional selfhood","behavior patterns",
    "repetitive coping loops","predictable reactions","entrenched habits","patterned responding","anticipatory appeasement","conflict minimizing",
    "chronic self adjustment","avoidance patterning","delay","disappearance","deferral","emotional ducking",
    "pre emptive defense","compulsive clarification","fear of misreading","rigidity","intolerance of uncertainty","compensatory micromanagement",
    "spontaneity","impulse led action","low premeditation","present driven responding","unpredictability","inconsistent follow through",
    "abrupt pivots","unstable behavioral continuity","sudden cutoffs","sharp reversals","impulsive exits","self sabotaging breaks",
    "improvisational style","adaptive","intuitive","makes structure in motion","functional chaos","masked hostility",
    "indirect aggression","lying by omission","selective truth","strategic silence","informational control","triangulation",
    "third party insertion","emotional leverage through outsiders","narrative splitting","covert testing","engineered scenarios","baiting for reaction",
    "disguised accusation","passive sabotage","subtle obstruction","hidden undermining","quiet noncooperation","false innocence",
    "rehearsed confusion","performative naivety","evasion under scrutiny","narrative revisionism","moving goalposts","self exonerating retellings",
    "transparency","direct disclosure","low concealment","observable motive","integrity","value behavior alignment",
    "ethical consistency","open accountability","admits fault","names impact","low defensiveness","relational dynamics",
    "attachment driven relating","bond insecurity","fear based reciprocity","anxious pursuit","abandonment sensitivity","hyper attunement to distance",
    "avoidant distancing","emotional withholding","intimacy resistance","push pull cycle","alternating pursuit and withdrawal","unstable closeness tolerance",
    "enmeshment","blurred separateness","overinvolvement","identity fusion","dependency pattern","overreliance",
    "diminished autonomy","externalized stability","control dynamic","monitoring","possessiveness","detachment",
    "emotional uncoupling","guardedness","relational de investment","individuation","stable separateness","selfhood retained in closeness",
    "non entanglement","connected but bounded","low fusion","differentiated intimacy","restoration through aloneness","low social dependence",
    "archetypal positions","savior complex","rescue identity","worth through fixing others","martyr pattern","self sacrifice",
    "grievance accumulation","unseen suffering identity","victim stance","powerlessness identity","injury centered meaning","external locus",
    "oppositional self definition","anti authority reflex","orphan pattern","belonging deficit","rejection sensitivity","attachment wound identity",
    "healer role","emotional labor identity","repair driven relating","scapegoat position","blame absorption","destroyer pattern",
    "destabilizing force","rupture as power","symbolic perception","nonordinary meaning making","role refusal","anti categorization",
    "symbolic resistance","fluid identity","shifts masks readily","context based selfhood","nonfixed persona","ambiguity",
    "hard to read motives","mixed symbolic signals","unclassifiable style","resists pattern assignment","low archetypal stability","somatic states",
    "vigilant body posture","sympathetic arousal","restless","keyed up","shallow breath","freeze pattern",
    "immobility","collapse under stress","flattening","reduced responsiveness","armoring","muscular guarding",
    "jaw tension","chest restriction","defensive posture","dysregulation","swings between activation and collapse","disembodiment",
    "head dominant functioning","low body awareness","sensation avoidance","numbness","psychic abstraction","overintellectualization",
    "symbolic displacement","thought over feeling","dissociative tendencies","fragmented embodiment","groundedness","affect linked to sensation",
    "present state access","felt time","dread stretched temporality","time drags under distress","urgency distortion","compressed time sense",
    "panic driven speed","pressure saturation","suspended time","waiting state consciousness","stalled momentum","frozen progression",
    "past saturated present","timeless flow","immersion state","loss of clock awareness","full absorption","schedule dependence",
    "external structuring","measured living","clock time dominance","punctuality fixation","quantitative time tracking","chronological framing",
    "linear sequencing","event order emphasis","narrative time coherence","weak connection to calendar reality","drifting timeline sense","outside of time feeling",
    "perception","threat scanning","overreading cues","anticipatory suspicion","projection prone","attributes inner material outward",
    "discernment intact","reads pattern accurately","signal noise separation preserved","symbolic over attribution","meaning saturation","excessive pattern linkage",
    "paranoia leaning","covert threat assumptions","guilt sensitive","self blaming","reparative drive","shame organized",
    "self condemning","identity level defectiveness","concealment urge","rationalization heavy","self excusing cognition","self righteousness",
    "superiority posture","judgment inflation","accountability deficits","values enacted consistently","communication style","direct",
    "plain spoken","low ambiguity","message congruent","evasive","circling","answer avoidant",
    "deflective","topic shifting","discomfort redirection","passive aggressive","indirect hostility","deniable contempt",
    "mixed signal delivery","anxious elaboration","pre emptive justification","combative defensiveness","disagreement sensitivity","perceived attack bias",
    "seductive language patterning","affective persuasion","charm as influence strategy","intimidating speech","volume escalation","dominance signaling",
    "coercive tone","boundary structure","overaccess granted","low self protection","suggestibility to others needs","defensive distance",
    "low permeability","intimacy restriction","fluctuating limits","situational overexposure and withdrawal","healthy boundarying","clear limits",
    "stable access control","differentiated self other line","intrusive questioning","emotional overreach","entitlement to access","secrecy reliance",
    "guarded disclosures","concealment as safety","motivational force","fear driven","avoidance led","safety over growth",
    "longing driven","attachment seeking","unmet need pursuit","control driven","revenge tinged","injury retention",
    "punitive fantasy","grievance fueled action","vanity led","image curation","status sensitivity","curiosity driven",
    "novelty seeking","exploratory cognition","short horizon thinking","crisis based decision structure","meaning hunger","self relation",
    "self trusting","internally anchored","coherent inner alliance","self betrayal pattern","overrides own knowing","chronic self abandonment",
    "self punitive","harsh inner authority","deprivation logic","no mercy internally","self forgiving","repair oriented",
    "non annihilating self reflection","inner conflict saturation","competing selves","unstable self loyalty","self possession","reality contact",
    "grounded","reality based","evidence responsive","denial based filtering","excludes unwanted reality","affect protective distortion",
    "fantasy dependence","retreat into imagined resolution","low action conversion","magical thinking","symbolic causality inflation","meaning action confusion",
    "dissociative reality thinning","weak present anchoring","outsider identification","edge of group stance","submission pattern","deference",
    "conflict avoidant lowering","invisibility adaptation","self erasure for safety","worth tied to impression management","belonging hunger","strong group acceptance drive",
    "narrative stance","survivor identity","adversity integrated self concept","endurance based meaning","perpetual victim narrative","repeated injury framing",
    "low agency tone","misunderstood self schema","chronic misrecognition theme","loneliness in perception","redeemer fantasy","salvation through love script",
    "transformational self mission","exile narrative","outsider destiny","severed from home identity","phoenix framing","destruction rebirth cycle",
    "reinvention identity","cursed self concept","repeated doom expectancy","fate colored interpretation","witness position","observer identity",
    "recorder not participant","collapse bringer self image","unconscious ending maker","identity formation","self assembly","role consolidation",
    "ego structuring","internal continuity","self concept stabilization","borrowed persona","adaptive masking","role confusion",
    "unstable self authorship","fractured self image","self-concept","stable self regard","fragile self regard","inflated self regard",
    "shame based self view","identity diffusion","overidentified competence","victim anchored identity","martyr anchored identity","rebel self definition",
    "rescuer self definition","approval built self","borrowed selfhood","role fused identity","self minimizing habit","counterfeit certainty",
    "core shame identity","fragile self cohesion","self possession in emergence","self-image","image based selfhood","aestheticized self-construction",
    "polished exterior fragile interior","public self private depletion split","body based worth","competence based worth","moral self image","damaged self image",
    "invisible self image","specialness fantasy","undesirable self image","chosen self image","idealized self image","self disgust",
    "reputation fixation","mirror fed identity","persona construction","compensatory persona","false maturity posture","hyper competent persona",
    "seductive persona","mystic persona","helper persona","strong one persona","innocent persona","misunderstood persona",
    "intellectual persona","stoic persona","wild persona","dark feminine persona","holy rebel persona","wounded healer persona",
    "overadapted persona","strategic softness persona","impression management","image custodianship","reputational editing","controlled vulnerability",
    "strategic disclosure","charm deployment","social camouflage","concealment of motive","prestige signaling","competence signaling",
    "softness signaling","spiritual image management","selective confession","technical innocence","performance based belonging","moral alignment",
    "ethical congruence","image led morality","conscience led behavior","self exempting principle use","harmony over truth bias","moral rigidity",
    "moral opportunism","self purifying guilt","value hierarchies","safety over truth","loyalty over honesty","peace over confrontation",
    "status over intimacy","belonging over authenticity","image over integrity","control over mutuality","admiration over humility","freedom over responsibility",
    "certainty over complexity","devotion over dignity","power over tenderness","survival over growth","harmony over accountability","pleasure over discipline",
    "meaning over evidence","self protection over transparency","motivation structures","fear driven action","avoidance led behavior","longing driven behavior",
    "revenge tinged motive","admiration seeking","hunger for union","predictability hunger","scarcity based motive","survival mode",
    "status pursuit","curiosity drive","sensation hunger","control seeking","shame avoidance","guilt reduction",
    "transcendence seeking","escape from self drive","avoidance","people pleasing","overexplaining","appeasement",
    "numbing","humor","sarcasm","working harder","cleaning to regulate","disappearing",
    "sleeping to escape","self soothing through ritual","fantasy retreat","hyperindependence","micromanagement","emotional shutdown",
    "crisis mobilization","isolation","compulsive talking","reassurance seeking","scrolling","substance use",
    "hostility masked as calm","confusion as defense","attachment styles","anxious attachment","avoidant attachment","fearful avoidant attachment",
    "disorganized attachment","secure attachment","ambivalent attachment","protest behavior","pursuit withdrawal cycle","reassurance hunger",
    "deactivation","hyperactivation","preemptive abandonment","intimacy intolerance","fusion hunger","hyperindependence as defense",
    "wounded loyalty","jealous vigilance","attachment surveillance","trust starvation","sentinel in intimacy","attachment through crisis",
    "triangle dependence","earned closeness incapacity","boundary patterns","porous boundaries","rigid boundaries","inconsistent boundaries",
    "collapsed boundaries","overguarded boundaries","guilt bound limits","overdisclosure","secrecy as safety","intrusion tolerance",
    "self negotiating against instincts","direct speech","evasive speech","circling speech","passive aggressive delivery","defensive verbosity",
    "semantic evasiveness","ambiguous phrasing","concern coded criticism","sweetened contempt","moralizing speech","monologic relating",
    "non answer compliance","narrative flooding","charm based deflection","pseudo vulnerability","confession theater","interrogative selfhood",
    "silence as leverage","conflict style","counterattack","delayed eruption","scorched earth reaction","micro retaliation",
    "scorekeeping","post conflict amnesia","compelled clarification","moral inversion","anti authority stance","submission as safety",
    "covert domination","soft domination","power avoidance","rank sensitivity","helplessness as control","moral high ground domination",
    "territoriality","dominance and submission patterns","coercive certainty","withhold to control","charm based authority","appeasing deference",
    "fearful compliance","pseudo submission tactic","dominance through stillness","loyalty extraction","shame based yielding","covert one upmanship",
    "trust calibration","immediate trust","guarded trust","slow earned trust","hypervigilant mistrust","betrayal expectancy",
    "selective trust","trust based on usefulness","trust based on consistency","trust collapse after rupture","reassurance invalidation","testing before trusting",
    "trust through intensity","trust through time","epistemic mistrust","catastrophic object constancy weakness","collapse","rage",
    "defensiveness","superiority","withdrawal","hiding","overachievement","perfectionism",
    "false modesty","self deprecation","self reproach","shame fueled generosity","shame fueled service","shame fueled silence",
    "shame fueled lying","shame fueled attack","projection patterns","motive misassignment","hostile attribution","jealousy projection",
    "guilt projection","infidelity projection","aggression projection","weakness projection","envy projection","betrayal projection",
    "disowned desire projected outward","shadow projection","fear labeled intuition","contamination projection","spiritualized projection","projective enactment",
    "mirrored shame","mirrored grandiosity","cognitive distortions","black and white thinking","mind reading","personalization",
    "overgeneralization","emotional reasoning","confirmation bias","hostile attribution bias","negative filtering","hope disqualifying cognition",
    "premature closure","self referential filtering","dissociation states","depersonalization","derealization","observer state",
    "absent presence","dreamlike functioning","time loss","emotional numbing","body detachment","faraway gaze",
    "freeze dissociation","overfunctioning while disconnected","post conflict blankness","memory gaps","shutdown","soft dissociative glide",
    "compartmentalized self states","unreality tone","nervous system regulation","grounded regulation","hyperarousal","hypoarousal",
    "freeze","fight activation","flight activation","dysregulation swings","bracing baseline","co regulation dependence",
    "interoception","body awareness intact","weak body reading","delayed hunger recognition","delayed fatigue recognition","confused anxiety and intuition",
    "numb sensation tracking","poor emotional labeling through body","strong visceral knowing","shallow breath unawareness","tension blindness","somatic alarm recognition",
    "body mistrust","proprioceptive underreading","trauma imprints","hypervigilance","abandonment anticipation","shame by exposure",
    "control as safety","appeasement reflex","freeze dominant coping","attachment triggered dysregulation","domestic hypervigilance","self trust erosion",
    "old danger in new rooms","survival mode bonding","panic in tenderness","memory patterning","selective recall","hypermnesic wound retention",
    "memory embalming","traumatic intrusion","narrative revision","state dependent memory","emotional chronology bias","anniversary activation",
    "confabulatory repair","unfinished goodbye replay","memory as identity scaffold","grief by substitution","role based remembering","memory gaps under stress",
    "symbolic thinking","pattern linking","synchronicity reading","metaphorizing events","archetypal overlay","sacred projection",
    "emblematic thinking","omen reading","ritual meaning assignment","dream coding","fate framing","allegorical identity",
    "symbolic concretization","meaning-making","survival narrative","redemption narrative","victim narrative","phoenix narrative",
    "karmic framing","lesson framing","mythic self story","existential meaning search","suffering as purpose","teleological defense",
    "spiritualized conflict","symbolic compensation","meaning monopolization","biography as defense","destiny language","ritualized behavior",
    "compulsive checking","repeated apology","cleansing rituals","bedtime control rituals","sobriety routines","relapse ritual sequences",
    "grief rituals","nervous fidget sequences","object anchors","overpreparation routines","beauty rituals for control","prayer loops",
    "pacing loops","restart rituals","outsider stance","insider performance","appeasing subordinate stance","dominance stance",
    "invisible observer stance","social climbing","edge of group positioning","alienation expectancy","validation gathering","low visibility strategy",
    "strategic affiliation","peripheral self positioning","group identity","tribe belonging","oppositional identity","clique attachment",
    "family role identity","subculture identity","martyr group role","scapegoat identity","chosen outsider identity","moral in-group loyalty",
    "spiritual community identity","rebel belonging","secret-knowledge belonging","performance belonging","loyalty through shared grievance","loyalty structures",
    "family loyalty over truth","trauma bond loyalty","devotion to harmful authority","loyalty through sacrifice","burden based belonging","secrecy based loyalty",
    "reciprocity based loyalty","hierarchy based loyalty","identity through allegiance","tribe before ethics","repair through allegiance","betrayal paranoia",
    "obligation without nourishment","taboo navigation","thrill seeking around forbidden material","moral splitting","secret indulgence","repression of desire",
    "fascination with transgression","eroticized taboo","purity obsession","hidden vice compartmentalization","secrecy around appetite","social mask over forbidden fantasy",
    "moral loopholing","deviance glamourization","secrecy and disclosure","compulsive secrecy","strategic opacity","coherence seeking",
    "self definition through contrast","perception and interpretation","meaning assignment","signal sorting","motive inference","contextual reading",
    "overinterpretation","selective attention","pattern imposition","cue sensitivity","ambiguity intolerance","interpretive rigidity",
    "embodiment","bodily self awareness","sensory grounding","somatic presence","instinct access","body trust",
    "numbed sensation","bodily alienation","muscular armoring","tension holding","visceral knowing","felt sense disruption",
    "social strategy","alliance building","status calibration","self positioning","tactical agreeableness","audience adaptation",
    "relational maneuvering","power and hierarchy","submission cues","authority testing","deference patterns","status vigilance",
    "territorial behavior","command tone","hierarchy navigation","prestige attachment","coercive positioning","subordination memory",
    "relational asymmetry","attachment and belonging","proximity seeking","inclusion hunger","attachment protest","reassurance dependence",
    "bondedness","relational anchoring","exile fear","belonging through compliance","emotional dependency","affiliative drive",
    "rejection vigilance","attachment instability","concealment and revelation","self protection through secrecy","partial exposure","concealed shame",
    "masked intent","privacy boundarying","covert signaling","rupture and repair","relational fracture","trust break",
    "emotional fallout","confrontation avoidance","repair attempt","accountability offering","reenactment cycle","apology deficit",
    "reconnection bid","defensive retreat","unresolved injury","restoration effort","repeated rupture pattern","morality and transgression",
    "ethical boundary testing","taboo crossing","self justification","moral conflict","rule violation","conscience strain",
    "rationalized harm","integrity lapse","forbidden impulse","reparation drive","transgressive thrill","symbolism and myth",
    "metaphorized experience","symbolic substitution","ritual meaning","narrative enchantment","mythic compensation","symbolic inflation",
    "imaginal structuring","meaning through allegory","temporality and memory","past saturation","memory weighting","nonlinear recall",
    "time distortion","anticipatory dread","future preoccupation","emotional chronology","memorial fixation","timeline fragmentation",
    "temporal dislocation","recollective bias","unfinished past","consciousness states","altered state access","trance susceptibility",
    "hyperlucidity","dissociative drift","narrowed consciousness","dreamlike processing","ecstatic absorption","depersonalized witnessing",
    "threshold awareness","state dependent meaning","adaptation and survival","resource conservation","opportunistic adjustment","survival intelligence",
    "self preservation reflex","stress adaptation","camouflage behavior","compromise for safety","environment scanning","resilience under constraint",
    "tactical retreat","desire and aversion","attraction pull","avoidance drive","craving structure","longing intensity",
    "repulsion coding","ambivalent wanting","forbidden desire","refusal patterning","attachment to absence","compulsive pursuit",
    "defensive disinterest","pleasure fear","truth","delusion","and narrative control","reality shaping",
    "story domination","self preserving narrative","perceptual distortion","false coherence","truth avoidance","reality editing",
    "delusional certainty","narrative seizure","counterfactual insistence","story based control","plausibility performance","liminal states",
    "in between identity","threshold instability","transitional selfhood","ambiguity tolerance","suspension phase","unfinished transformation",
    "category refusal","psychic doorway state","not yet formed stance","dissolution before reorganization","uncertain emergence","edge consciousness",
    "threshold holding","psychic economy","emotional expenditure","defensive budgeting","depletion cycle","attachment investment",
    "shame taxation","fantasy as compensation","desire rationing","motivational scarcity","psychic overload","internal resource hoarding",
    "affective spending","conflict cost","symbolic overinvestment","ontological stance","reality assumptions","being in the world",
    "metaphysical posture","skepticism level","faith structure","existential anchoring","certainty need","materialist framing",
    "mystical openness","essence attribution","reality relation style","affective texture","emotional grain","mood coloration",
    "tonal density","irritability baseline","tenderness capacity","dread undertone","melancholic wash","numb flatness",
    "volatility","fragile warmth","cold defensiveness","bittersweet attachment","emotional roughness","affective saturation",
    "behavioral residue","leftover coping pattern","habitual afterimage","repeated reaction trace","trauma imprint in conduct","residual defensiveness",
    "learned posturing","conditioned withdrawal","compulsive repetition","protective reflex","stale adaptation","embodied memory in action",
    "interactional carryover","unresolved pattern leak","post event behavioral echo","intrapsychic conflict","competing drives","self division",
    "ambivalence strain","inner opposition","guilt versus desire","protector versus vulnerable self","fragmentation pressure","contradictory self commands",
    "split loyalties","internal negotiation failure","self sabotage conflict","unresolved psychic tension","divided will","embodied cognition",
    "thought through sensation","bodily reasoning","posture shaped perception","visceral appraisal","cognition tied to physiology","somatic prediction",
    "tension informed judgment","movement based knowing","nervous system framing","body state dependent thought","felt inference","sensory weighted interpretation",
    "cognition under arousal","narrative identity","self story architecture","autobiographical framing","continuity through narrative","chosen meaning line",
    "victim script","survivor script","redeemer script","exile script","self mythologizing","revisionist self telling",
    "identity through remembered plot","psychosocial mirroring","reflected selfhood","social echoing","approval based self recognition","projected role uptake",
    "interpersonal reflection hunger","co created identity","validation dependency","social feedback imprint","reciprocal image making","emotional contagion shaping self sense",
    "shadow material","disowned impulse","repressed hostility","covert envy","hidden need","denied aggression",
    "forbidden fantasy","shame sealed content","projected darkness","split off motive","unconscious contempt","buried appetite",
    "moral self discrepancy","unclaimed vulnerability","concealed destructiveness","threshold consciousness","edge awareness","pre verbal knowing",
    "dawning recognition","near dream cognition","symbolic surfacing","limen sensitivity","unstable but potent awareness","almost conscious material",
    "faint intuitive registration","partial emergence","twilight perception","crossing into insight","mind at the doorway","fantasy for deficiency",
    "image filling absence","exaggerated spiritual meaning","overidentification with symbol","ritualized control","mythic cover for wound","aesthetic compensation",
    "symbolic inflation against powerlessness","substitute meaning structure","inner lack disguised as destiny","emblematic overcorrection","psychic balancing through image","existential dissonance",
    "life meaning fracture","value reality mismatch","spiritual disquiet","ontological unease","alienation from purpose","absurdity contact",
    "being stranded in self awareness","despair under lucidity","emptiness under function","existential split","significance hunger","moral injury",
    "betrayal of conscience","violation by self or authority","ethical shock","guilt scar","shame saturation","trust collapse in the good",
    "soul level offense","desecration feeling","damage to moral identity","spiritual contamination","conscience wound","perceptual framing",
    "lens selection","contextual biasing","foreground background assignment","emotional coloring of input","narrative lensing","assumption guided reading",
    "frame locked interpretation","threat framing","victim framing","sacred framing","cynical framing","scarcity framing",
    "control framing","possibility framing","third party leverage","alliance manipulation","outsider recruitment","emotional proxy warfare",
    "comparison insertion","destabilization through third presence","competitive attachment","covert coalitions","dyadic contamination","triangulated validation seeking",
    "somatic encoding","body stored memory","symptom as message","tension as archive","procedural pain memory","posture based defense",
    "autonomic imprinting","trauma held in musculature","sensation linked meaning","embodied alarm pattern","physicalized conflict","body as mnemonic system",
    "archetypal possession","overidentification with symbolic role","savior takeover","martyr fixation","destroyer dominance","mystic inflation",
    "victim enthrallment","shadow ruled behavior","role trance","myth driven action","ego eclipsed by pattern","compulsive enactment of archetype",
    "symbolic seizure","identity subsumed by psychic image","temporal drag","slowed subjective time","prolonged waiting state","inertial mood field",
    "depressive duration","stuckness in time","heavy sequence flow","delayed psychic processing","inability to transition","emotional time lag",
    "momentum loss","dragged future","elongated suffering","stalled becoming","affective forecasting","predicted emotional outcome",
    "imagined future feeling","dread projection","hope projection","mispredicted satisfaction","anticipated regret","emotional expectation mapping",
    "fear of future affect","craving based forecasting","disappointment rehearsal","mood estimation bias","future self feeling script",
  
    "vanished in a puff of glitter","the door was never there","stepped through and became the sky","the key dissolved in the lock","no lock no door no before","the spell was to leave",
    "the room forgot me instantly","already mist","the old name turned to smoke","walked out and the house sighed with relief","the wand snapped on purpose","the cloak dropped mid step",
    "the map burned itself behind me","no breadcrumb trail just moonlight","the threshold winked and let me through","the goodbye turned to birds","the hex was lifted by leaving","already moved into the enchantment",
    "the mirror showed nothing and that was the point","the path closed like water","the departure was the incantation","the former self turned to petals","whispered something and it opened","the leaving was luminous",
    "the exit bloomed","the door appeared when I said nothing","the silence after was golden","already in the other story","the cape swirled and I was elsewhere","the roots let go gladly",
    "the wave was a spell","the old chapter sealed with wax and light","the turning point was stardust","the escape left a constellation","the incantation was silence","the step was the portal",
    "the gate was gossamer","the vanish was velvet and stars","no trail no trace just a shimmer","the old grew transparent then disappeared","the leave was levitation","the key was never metal just a look",
    "the walk was winged","the before folded into a paper crane and flew","the darkness knitted itself shut behind me","already in the glow","the spell was simple walk and mean it","the vanishing act had no audience just awe",
    "the door bowed and disappeared","the release shimmered","the gone was golden","the next chapter opened with light","the mirror cracked with gratitude","the way out was made of breath",
    "the end was a beginning wearing a cape",
    "the old me is restricted","i muted my own lore","the backstory is paywalled","i dont have access to that version anymore","the origin story got boring so i wrote a new one","left my own close friends list",
    "the highlight reel expired","the old chapters are out of print","i archived myself without warning","the username felt heavy so i changed it","the bio used to be a confession now its just empty","no era no aesthetic no explanation",
    "the rebrand was silent and final","the old posts deleted themselves when i did","i stopped being a regular at my own sadness","the bit was tired so i killed it","the character development was cutting everyone off including me","my past self keeps typing",
    "i leave them on read","the lore got too long so i skipped to the end","no callback no reference no revival","the former me has no signal","i left the narrative mid season","the plot needed no closure",
    "the show was cancelled by me","i stopped performing the self","the identity leaked so i drained it","my old tweets sound like a stranger","i dont correct them","the memory folder was corrupted",
    "i deleted it without checking","the vibe was a rental","i moved out","the timeline broke and i stepped over the crack","no recap no summary no moral","the profile is blank and that is the statement",
    "the brand went independent and then dissolved","the past is a podcast i stopped listening to","unpinned the trauma","unhearted the old posts","the persona had a system error","i let it crash",
    "the old life is a screenshot in a deleted chat","the exit interview was with myself","i said nothing helpful","the vibe audit said let it all go","the former voice is on mute and the new one hums","the me that stayed up worrying is asleep now",
    "i stopped checking for updates","the old life stopped loading","i refreshed and it was gone","the goodbye was a terms and conditions update","i scrolled past","the data didnt sync so i left it",
    "the old self is a spam folder","empty and ignored","the notification dot disappeared",
    "has a full soul","has a strong soul","has a weak soul","has a special soul","soul is different","has an old soul",
    "has a new soul","has a powerful soul","has a very weak soul","is soulless","born soulless","never had a soul",
    "lacking a soul","soul is gone now","loses soul in life","secretly hates others","secretly hates close friends","secretly useful",
    "how many secrets","has no secrets","had many secrets","had a few secrets","secretly smart","secretly evil",
    "neutral always","is always neutral","is never neutral","thinks they are a genius","not actually smart","understands a lot about the world",
    "is soulless","born soulless",
    "main chick energy","the plug","the leech","brought the energy","type to ghost","type to double back",
    "rare commodity","regular degular","one of one","real prize","is the chaos","is the peace",
    "type to slide","type to hide","built for the pressure","came from the mud","never seen the mud","earned every stripe",
    "bought their stripes","on demon time","on angel time","balanced energy","toxic energy","healing energy",
    "draining energy","type to heal you","type to break you",]],
  ["events", "events", [
    "sudden disruption","gradual shift","unexpected outcome","predictable pattern","controlled incident","major escalation",
    "isolated event","chain reaction","systemic failure","brief interruption","extended duration","rapid onset",
    "slow buildup","delayed impact","critical moment","turning point","breaking event","decisive shift",
    "defining incident","rare anomaly","recurring pattern","one time event","cyclical phase","high impact event",
    "low level activity","subtle change","moderate fluctuation","planned operation","unplanned incident","coordinated action",
    "contained situation","spreading effect","localized issue","widespread impact","global shift","volatile phase",
    "balanced state","unstable period","resolved event","ongoing situation","unfolding scenario","concluded incident",
    "pending outcome","successful completion","goal achieved","milestone reached","target met","objective fulfilled",
    "deal closed","conflict resolved","trust established","opportunity seized","timely decision made","risk paid off",
    "breakthrough realized","financial gain realized","health improved","recovery completed","task failed","goal missed",
    "deadline broken","target unmet","plan collapsed","deal lost","partnership ended","opportunity missed",
    "error made","mistake repeated","system failed","conflict escalated","trust broken","relationship strained",
    "loss incurred","money lost","debt increased","injury sustained","health declined","reputation damaged",
    "credibility lost","trust reduced","influence weakened","next phase deployment plan","executed step","resolved operation",
    "prior action taken","previous step executed","earlier task handled","former action applied","already completed","done in advance",
    "handled beforehand","resolved earlier","just completed","recently executed","freshly finished","newly resolved",
    "just handled","long completed action","previously finalized","historically executed","old task closure","repeated past action",
    "previous pattern applied","prior loop executed","routine completed","corrected past action","error adjusted step","missed past action",
    "skipped step","unhandled task","dropped sequence","belated step","skill mastered","knowledge gained",
    "training completed","certification earned","ability improved","relationship strengthened","connection formed","reconciliation achieved",
    "advantage gained","income increased","debt reduced","asset acquired","investment returned","energy restored",
    "habit established","consistency maintained","project delivered","plan executed","strategy validated","outcome optimized",
    "contract voided","client dropped","argument triggered","asset depleted","investment failed","recovery delayed",
    "energy depleted","condition worsened","project delayed","progress stalled","rule violated","policy breached",
    "compliance failed","penalty applied","misjudgment made","poor decision taken","risk misread","warning missed",
    "standing lowered","projected outcome","expected result","anticipated shift","forecasted event","planned launch",
    "upcoming release","future deployment","set activation","likely success","probable gain","expected growth",
    "projected increase","positive trend","possible failure","risk exposure","potential loss","forecasted decline",
    "negative outlook","next phase initiation","stage transition pending","progression trigger set","opportunity emerging","advantage forming",
    "access increasing","entry point appearing","challenge incoming","pressure building","constraint forming","obstacle ahead",
    "resistance expected","long term expansion","future scaling","growth trajectory set","capacity increase planned","extended development path",
    "upcoming state transition","basic routine","daily schedule","existing baseline","existing framework","existing pattern",
    "expected variation","general outcome","habit formation","incremental progress","incremental shift","input output cycle",
    "internal process","measured output","relative position","repeating pattern","routine action","steady baseline",
    "existing sequence","incremental adaptation","routine process","routine mindset","routine attention","routine inconsistencies",
    "daily routine framework","daily cycle","high level oversight","strong leadership core","ineffective management layer","structural imbalance",
    "structural inefficiency","structural model","planned sequencing","low morning tolerance","strong intuition","high retention",
    "high accountability","high value interest","strong connector","disorganized environment","high value contact builder","unstructured exploration",
    "evidence destruction","unresolved past attachment","keeping evidence logs","evidence banking","intent vs impact inversion","moral high grounding",
    "day structured action map","impending shift notice","bad at math","high risk occupation","low risk occupation","low skill requirement role",
    "decay sets in","growth resumes slowly","rot spreads inward","spring follows winter","cracks deepen daily","scars form over",
    "drained their goodwill","took without asking","forgot their birthday","borrowed their car","never said thank you","asked for favors constantly",
    "returned nothing back","left them waiting","spent their money freely","missed their important day","cancelled via text message","showed up hours late",
    "did not apologize ever","stole from them","robbed money","stole assets","gave away things","promotion secured",
    "contract signed","client acquired","award received","ranking improved","issue fixed","cause initiated",
    "effect produced","trigger activated","outcome realized","action driven","resulting state","input transformed",
    "output generated","cascading impact","following consequence","source event","derived result","resultant shift",
    "process unfolding","end state formed","influence exerted","reaction induced","root cause identified","proximate cause triggered",
    "downstream effect observed","secondary outcome formed","tertiary impact emerging","driving force applied","intervening variable active","feedback loop engaged",
    "runaway escalation","threshold crossed","tipping point reached","lagged effect appearing","compounding influence building","residual impact persisting",
    "spillover effect occurring","indirect consequence arising","knock on effect spreading","terminal outcome fixed","chain structure","reaction lag",
    "root cause isolation","trigger identification","feedback loop control","influence mapping","loops on thoughts","outcome prediction",
    "outcome biasing","feedback sculpting","outcome projection","trigger control","reaction dampening","influence buffering",
    "outcome oriented logic","cause and effect awareness","outcome steering quietly","end state oriented timeline","tidal pull","root system",
    "storm pattern","fault line","pressure point","surface tension","magnetic field","decay rate",
    "growth cycle","erosion path","sediment layer","water table","current direction","wind resistance",
    "thermal shift","density change","crystalline structure","wave frequency","resonance point","interference pattern",
    "absorption rate","reflection angle","refraction path","dispersion field","gravity well","orbital path",
    "eclipse alignment","solar return","lunar phase","tidal lock","polar shift","axis tilt",
    "magnetic north","true north","deviation point","convergence zone","divergence field","pressure front",
    "cold front","warm front","stagnant air","moving mass","still water","deep current",
    "surface current","undertow","riptide","backwash","groundswell","same story different year",
    "different face same pattern","new name old lesson","familiar entry new exit","same wound different dressing","new ground old question","different city same ache",
    "before the funeral","the morning after","the night before","the first day alone","the last shared meal","the final phone call",
    "the beginning of the ending","room felt wrong","air was heavy","silence was thick","light was strange","quiet was loud",
    "space was full","room was waiting","air shifted subtly",
  ]],
  ["language", "language", [
    "left unspoken","never questioned","did not need","words restrained","said just enough","nearly spoken",
    "silence maintained","meaning inferred","kept internal","left unresolved","almost revealed","intention implied",
    "message indirect","unstated agreement","unasked question","unvoiced thought","subtext carried","nothing declared",
    "barely implied","left hanging","unanswered still","almost answered","never voiced","quietly held",
    "kept beneath","not brought up","held in reserve","signal muted","message softened","truth deferred",
    "left between lines","hinted only","spoken indirectly","kept unsaid still","not fully stated","left for inference",
    "meaning unspoken","predictive onset cue","looming development cue","advance change indicator",
  ]],
];
// Build a Map from normalized phrase → category label at module level — O(1) lookup at build time
const PHRASE_CAT_MAP = new Map();
for (const [label, , phrases] of CATEGORY_DEFS) {
  for (const p of phrases) {
    const n = p.toLowerCase().replace(/[^a-z ]/g,"").replace(/\s+/g," ").trim();
    if (!PHRASE_CAT_MAP.has(n)) PHRASE_CAT_MAP.set(n, label);
  }
}

// Category keys for UI — ordered list of [label, shortLabel]
const CATEGORIES = CATEGORY_DEFS.map(([label, short]) => ({ label, short }));

// ================================================================
// § SEED PHRASES
// ================================================================
const CIPHERS = {
  simple:        { key:"simple",        label:"Simple English", short:"SE",  color:"#38bdf8" },
  reverseSimple: { key:"reverseSimple", label:"Reverse Simple", short:"RS",  color:"#c084fc" },
  weighted:      { key:"weighted",      label:"Weighted",       short:"WG",  color:"#f472b6" },
  ascii:         { key:"ascii",         label:"ASCII",          short:"AC",  color:"#4ade80" },
  shadow:        { key:"shadow",        label:"Shadow",         short:"SH",  color:"#fb923c" },
  eclipse:       { key:"eclipse",       label:"Eclipse",        short:"EC",  color:"#e879f9" },
  pythagorean:   { key:"pythagorean",   label:"Pythagorean",    short:"PY",  color:"#facc15" },
  prime:         { key:"prime",         label:"Prime",          short:"PR",  color:"#2dd4bf" },
};
const CIPHER_KEYS = ["simple","reverseSimple","weighted","ascii","shadow","eclipse","pythagorean","prime"];

const RAINBOW = ["#ff4444","#ff8c00","#ffd700","#4ade80","#38bdf8","#818cf8","#c084fc"];

// ================================================================
// § GEMATRIA ENGINE
// ================================================================
function normalize(raw) {
  return String(raw ?? "")
    .toLowerCase()
    .replace(/[^a-z ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function letterCount(norm) { return norm.replace(/ /g, "").length; }
function wordCount(norm)   { return norm ? norm.split(" ").length : 0; }

function digitalRoot(n) {
  if (n === 0) return 0;
  const r = Math.abs(n) % 9;
  return r === 0 ? 9 : r;
}

const VOWELS = new Set(["a","e","i","o","u"]);

/**
 * Single-pass fused cipher — computes simple, reverseSimple, and ascii
 * in one character loop instead of three separate traversals.
 */
// Pythagorean lookup: A-Z mapped to 1-9 repeating (classical numerology)
// A=1 B=2 C=3 D=4 E=5 F=6 G=7 H=8 I=9 J=1 K=2 L=3 M=4 N=5 O=6 P=7 Q=8 R=9 S=1 T=2 U=3 V=4 W=5 X=6 Y=7 Z=8
const PYTH_MAP = [1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8,9,1,2,3,4,5,6,7,8];

// Prime lookup: A=2, B=3, C=5... first 26 primes
const PRIME_MAP = [2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97,101];

/**
 * Single-pass fused cipher — computes simple, reverseSimple, ascii,
 * pythagorean, and prime in one character loop.
 */
function ciphersFused(norm) {
  let simple = 0, rev = 0, ascii = 0, pyth = 0, prime = 0;
  for (let i = 0; i < norm.length; i++) {
    const cc = norm.charCodeAt(i);
    if (cc < 97 || cc > 122) continue;
    const idx = cc - 97;  // 0–25
    const v   = idx + 1;  // 1–26
    simple += v;
    rev    += 27 - v;
    ascii  += cc;
    pyth   += PYTH_MAP[idx];
    prime  += PRIME_MAP[idx];
  }
  return { simple, reverseSimple: rev, ascii, pythagorean: pyth, prime };
}

/**
 * Weighted cipher — Buster's formula:
 * V(letter) = L × (1 + (p−1)/n) × (1 + (w−1)/W)
 * Receives pre-split words array to avoid re-splitting norm.
 */
function cipherWeighted(words) {
  const W = words.length;
  if (W === 0) return 0;
  let total = 0;
  for (let wi = 0; wi < W; wi++) {
    const word = words[wi];
    const n = word.length;
    if (n === 0) continue;
    const wFactor = 1 + wi / W;
    for (let pi = 0; pi < n; pi++) {
      total += (word.charCodeAt(pi) - 96) * (1 + pi / n) * wFactor;
    }
  }
  return Math.round(total);
}

/**
 * Shadow + Eclipse — single traversal, receives pre-split words.
 */
function cipherShadowEclipse(words) {
  const W = words.length;
  if (W === 0) return { shadow: 0, eclipse: 0 };
  let shadowTotal = 0, eclipseTotal = 0;
  for (let wi = 0; wi < W; wi++) {
    const word = words[wi];
    const n = word.length;
    if (n === 0) continue;
    const freq = {};
    for (let i = 0; i < n; i++) {
      const ch = word[i]; freq[ch] = (freq[ch] || 0) + 1;
    }
    const adj0   = 27 - (word.charCodeAt(0) - 96);
    const adjFirst = VOWELS.has(word[0])     ? adj0 / 2   : adj0;
    const adjN1  = 27 - (word.charCodeAt(n - 1) - 96);
    const adjLast  = VOWELS.has(word[n - 1]) ? adjN1 / 2  : adjN1;
    let wordTotal = 0;
    for (let i = 0; i < n; i++) {
      const ch = word[i];
      const rv = 27 - (word.charCodeAt(i) - 96);
      wordTotal += (VOWELS.has(ch) ? rv / 2 : rv) * (n - i) * freq[ch];
    }
    const d = wi + 1;
    shadowTotal  += (wordTotal - adjLast) / d;
    eclipseTotal += (wordTotal + Math.abs(adjFirst - adjLast) - adjLast) / d;
  }
  return { shadow: Math.round(shadowTotal), eclipse: Math.round(eclipseTotal) };
}

/** Compute all 8 cipher values — words array split once, shared across all ciphers. */
function calcValues(norm) {
  const words = norm.split(" ");
  const fused = ciphersFused(norm);
  const se    = cipherShadowEclipse(words);
  return {
    simple:        fused.simple,
    reverseSimple: fused.reverseSimple,
    weighted:      cipherWeighted(words),
    ascii:         fused.ascii,
    shadow:        se.shadow,
    eclipse:       se.eclipse,
    pythagorean:   fused.pythagorean,
    prime:         fused.prime,
  };
}

// ================================================================
// § DATA LAYER
// ================================================================
function buildDataset(phrases) {
  const seen = new Set();
  const out  = [];
  let   id   = 0;
  for (let i = 0; i < phrases.length; i++) {
    const raw  = String(phrases[i] ?? "").trim();
    if (!raw) continue;
    const norm = normalize(raw);
    if (!norm || seen.has(norm)) continue;
    const wc = wordCount(norm);
    const lc = letterCount(norm);
    if (wc < 1 || wc > 9 || lc < 1 || lc > 60) continue;
    seen.add(norm);
    const words = norm.split(" ");
    const cat   = PHRASE_CAT_MAP.get(norm) || "other";
    out.push({ id: id++, raw, norm, words, cat, values: calcValues(norm), wc, lc });
  }
  return out;
}

function buildIndexes(entries) {
  const idx = {};
  for (const c of CIPHER_KEYS) idx[c] = {};
  // Category index: label → Set of entry ids
  const catIdx = {};
  for (const { label } of CATEGORIES) catIdx[label] = new Set();
  catIdx["other"] = new Set();

  for (const e of entries) {
    for (const c of CIPHER_KEYS) {
      const v = e.values[c];
      if (!idx[c][v]) idx[c][v] = [];
      idx[c][v].push(e);
    }
    if (catIdx[e.cat]) catIdx[e.cat].add(e.id);
    else catIdx["other"].add(e.id);
  }
  const sortedVals = {};
  for (const c of CIPHER_KEYS) {
    sortedVals[c] = Object.keys(idx[c]).map(Number).sort((a, b) => a - b);
  }
  return { idx, sortedVals, catIdx };
}

// ================================================================
// § CALCULATOR ENGINE
// ================================================================
function calcExpression(terms) {
  const parsed = [];
  for (const t of terms) {
    const norm = normalize(t.text);
    if (!norm.length) continue;
    // Issue #4: only copy the fields we actually need downstream
    parsed.push({ id: t.id, op: t.op, norm, values: calcValues(norm), wc: wordCount(norm), lc: letterCount(norm) });
  }
  if (!parsed.length) return null;

  const totals = { simple: 0, reverseSimple: 0, weighted: 0, ascii: 0, shadow: 0, eclipse: 0 };
  let totalWC = 0;
  for (let i = 0; i < parsed.length; i++) {
    const t    = parsed[i];
    const sign = (i === 0 || t.op === "+") ? 1 : -1;
    for (const c of CIPHER_KEYS) totals[c] += sign * t.values[c];
    totalWC += t.wc;
  }

  const avg = {};
  for (const c of CIPHER_KEYS) avg[c] = totalWC > 0 ? Math.round(totals[c] / totalWC) : 0;

  return { parsed, totals, avg, totalWC };
}

/** Find k nearest distinct values using a two-pointer walk from the binary-search
 *  insertion point — O(k) with no extra array allocation or sort. */
function nearestInIndex(idx, sortedVals, cipher, target, k = 6) {
  const vals = sortedVals[cipher];
  const len  = vals.length;
  if (len === 0) return [];

  // Binary search for insertion point
  let lo = 0, hi = len;
  while (lo < hi) { const mid = (lo + hi) >> 1; if (vals[mid] < target) lo = mid + 1; else hi = mid; }

  const results = [];
  let left = lo - 1, right = lo;
  while (results.length < k && (left >= 0 || right < len)) {
    const dLeft  = left  >= 0   ? Math.abs(vals[left]  - target) : Infinity;
    const dRight = right  < len ? Math.abs(vals[right] - target) : Infinity;
    const v = dLeft <= dRight ? vals[left--] : vals[right++];
    results.push({ value: v, delta: v - target, entries: idx[cipher][v].slice() });
  }
  return results;
}

// ================================================================
// § HISTORY STORE
// ================================================================
const MAX_HISTORY = 40;
function historyReducer(state, action) {
  switch (action.type) {
    case "push": {
      const item    = { text: action.text, ts: Date.now() };
      const deduped = state.filter(h => h.text !== action.text);
      return [item, ...deduped].slice(0, MAX_HISTORY);
    }
    case "clear":  return [];
    case "remove": return state.filter(h => h.ts !== action.ts);
    default:       return state;
  }
}

// ================================================================
// § CLIPBOARD HOOK
// ================================================================
function useCopy() {
  const [copiedId, setCopiedId] = useState(null);
  const timerRef = useRef(null);
  const copy = useCallback((text, id) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        setCopiedId(id);
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopiedId(null), 1500);
      });
    }
  }, []);
  useEffect(() => () => clearTimeout(timerRef.current), []);
  return { copy, copiedId };
}

// ================================================================
// § DEBOUNCE HOOK
// ================================================================
function useDebounce(value, ms = 120) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

// Precomputed gradient stops — static strings, no template literal work on render
const RAINBOW_GRADIENT_STOPS = RAINBOW.map((c, i) => ({
  offset: `${(i / (RAINBOW.length - 1)) * 100}%`,
  color:  c,
}));

// Precomputed arc paths for RainbowEye — static geometry, no trig on every render
const RAINBOW_EYE_ARCS = RAINBOW.map((c, i) => {
  const a1 = (i / RAINBOW.length) * Math.PI * 2;
  const a2 = ((i + 1) / RAINBOW.length) * Math.PI * 2;
  const r  = 18;
  return {
    color: c,
    d: `M ${50+r*Math.cos(a1)} ${30+r*Math.sin(a1)} A ${r} ${r} 0 0 1 ${50+r*Math.cos(a2)} ${30+r*Math.sin(a2)}`,
  };
});

// FIX #7: memo — pure static SVG, never needs to re-render
const RainbowEye = memo(function RainbowEye({ size = 46 }) {
  const id = "re3";
  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 100 60"
      style={{ display:"block", overflow:"visible", flexShrink:0 }}>
      <defs>
        <linearGradient id={`${id}g`} x1="0%" y1="0%" x2="100%" y2="0%">
          {RAINBOW_GRADIENT_STOPS.map(({ offset, color: c }, i) => (
            <stop key={i} offset={offset} stopColor={c}/>
          ))}
        </linearGradient>
        <radialGradient id={`${id}i`} cx="50%" cy="40%" r="50%">
          <stop offset="0%"   stopColor="#c084fc" stopOpacity="0.9"/>
          <stop offset="40%"  stopColor="#818cf8" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.6"/>
        </radialGradient>
        <clipPath id={`${id}c`}>
          <path d="M5 30 Q50 -8 95 30 Q50 68 5 30 Z"/>
        </clipPath>
        <filter id={`${id}f`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <path d="M5 30 Q50 -8 95 30 Q50 68 5 30 Z" fill="none"
        stroke={`url(#${id}g)`} strokeWidth="1.5" opacity="0.25"
        filter={`url(#${id}f)`}
        style={{transform:"scale(1.08)",transformOrigin:"50px 30px"}}/>
      <circle cx="50" cy="30" r="18" fill={`url(#${id}i)`}
        clipPath={`url(#${id}c)`} opacity="0.85"/>
      {RAINBOW_EYE_ARCS.map(({ color: c, d }, i) => (
        <path key={i} d={d}
          fill="none" stroke={c} strokeWidth="2.5"
          clipPath={`url(#${id}c)`} opacity="0.9"/>
      ))}
      <circle cx="50" cy="30" r="9" fill="#050d1a" clipPath={`url(#${id}c)`}/>
      <circle cx="50" cy="30" r="9" fill="none" stroke={`url(#${id}g)`}
        strokeWidth="1.5" clipPath={`url(#${id}c)`} opacity="0.8"/>
      <path d="M5 30 Q50 -8 95 30 Q50 68 5 30 Z" fill="none"
        stroke={`url(#${id}g)`} strokeWidth="2.5" filter={`url(#${id}f)`}/>
      <ellipse cx="42" cy="23" rx="4.5" ry="2.5" fill="white" opacity="0.3"
        clipPath={`url(#${id}c)`}/>
    </svg>
  );
});

// FIX #10: precompute static "Ode-N" rainbow spans at module level — no per-render work
const RAINBOW_TEXT_CHARS = "Ode-N".split("").map((ch, i, arr) => ({
  ch,
  color: RAINBOW[Math.round((i / Math.max(arr.length-1,1))*(RAINBOW.length-1))],
}));

const RainbowText = memo(function RainbowText({ size = 30 }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"baseline", letterSpacing:"-0.5px" }}>
      {RAINBOW_TEXT_CHARS.map(({ ch, color }, i) => (
        <span key={i} style={{
          color, fontSize:size, fontWeight:900,
          fontFamily:"'Courier New',monospace",
          textShadow:`0 0 16px ${color}88`,
          lineHeight:1,
        }}>{ch}</span>
      ))}
    </span>
  );
});

// ================================================================
// § DESIGN TOKENS — pure black mobile-first theme
// ================================================================
const T = {
  bg0:      "#000000",
  bg1:      "#0d0d0d",
  bg2:      "#151515",
  border:   "#1e1e1e",
  border2:  "#2a2a2a",
  text:     "#e8e8e8",
  textDim:  "#444444",
  textMid:  "#888888",
  mono:     "'Courier New', Courier, monospace",
  radius:   10,
  radiusLg: 14,
};

// ================================================================
// § PRIMITIVE UI COMPONENTS
// ================================================================
const Card = memo(({ children, style }) => (
  <div style={{
    background:   T.bg1,
    border:       `1px solid ${T.border}`,
    borderRadius: T.radiusLg,
    padding:      "16px",
    marginBottom: 12,
    ...style,
  }}>
    {children}
  </div>
));

const SectionLabel = memo(function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize:      11,
      fontWeight:    700,
      color:         T.textDim,
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      marginBottom:  12,
    }}>{children}</div>
  );
});

const FieldLabel = memo(function FieldLabel({ children }) {
  return (
    <div style={{
      fontSize:      11,
      color:         T.textMid,
      marginBottom:  5,
      letterSpacing: "0.04em",
    }}>{children}</div>
  );
});

const baseInputStyle = {
  width:        "100%",
  padding:      "12px 14px",
  borderRadius: T.radius,
  border:       `1px solid ${T.border}`,
  background:   T.bg0,
  color:        T.text,
  fontSize:     15,
  fontFamily:   "'Courier New', Courier, monospace",
  boxSizing:    "border-box",
  outline:      "none",
  WebkitAppearance: "none",
};

function Inp({ value, onChange, placeholder, type="text", min, max, accentColor, style: ext, onKeyDown }) {
  return (
    <input
      type={type} value={value} onChange={onChange}
      placeholder={placeholder} min={min} max={max}
      onKeyDown={onKeyDown}
      style={{
        ...baseInputStyle,
        borderColor: value ? (accentColor || T.border2) : T.border,
        ...ext,
      }}
    />
  );
}

const Btn = memo(({ onClick, children, active, color, style: ext, title }) => (
  <button onClick={onClick} title={title} style={{
    padding:      "9px 14px",
    borderRadius: T.radius,
    border:       `1px solid ${active ? (color || T.border2) : T.border}`,
    background:   active ? `${color || "#38bdf8"}1a` : "transparent",
    color:        active ? (color || "#38bdf8") : T.textMid,
    cursor:       "pointer",
    fontSize:     12,
    fontFamily:   "'Courier New', Courier, monospace",
    whiteSpace:   "nowrap",
    ...ext,
  }}>{children}</button>
));

const CopyBtn = memo(function CopyBtn({ text, id, copy, copiedId, style: ext }) {
  const done = copiedId === id;
  return (
    <button
      onClick={e => { e.stopPropagation(); copy(text, id); }}
      title="Copy to clipboard"
      style={{
        background: "transparent",
        border:     "none",
        color:      done ? "#4ade80" : T.textDim,
        cursor:     "pointer",
        fontSize:   13,
        padding:    "4px 6px",
        fontFamily: "'Courier New', Courier, monospace",
        flexShrink: 0,
        minWidth:   28,
        minHeight:  28,
        display:    "flex",
        alignItems: "center",
        justifyContent: "center",
        ...ext,
      }}>
      {done ? "✓" : "⎘"}
    </button>
  );
});

const ValueBadge = memo(function ValueBadge({ cipher, value, showRoot = false }) {
  const { short, color } = CIPHERS[cipher];
  const root = digitalRoot(value);
  return (
    <span style={{
      display:    "inline-flex",
      alignItems: "center",
      gap:        4,
      padding:    "4px 10px",
      borderRadius: 6,
      border:     `1px solid ${color}33`,
      fontSize:   12,
      fontFamily: "'Courier New', Courier, monospace",
      fontWeight: 700,
      color,
      flexShrink: 0,
      whiteSpace: "nowrap",
    }}>
      <span style={{ color:`${color}55`, fontWeight:400, fontSize:10 }}>{short}</span>
      {value}
      {showRoot && <span style={{ color:`${color}44`, fontSize:9 }}>/{root}</span>}
    </span>
  );
});

function EmptyState({ text }) {
  return (
    <div style={{ color:T.textDim, fontSize:13, padding:"20px 0", textAlign:"center" }}>
      {text}
    </div>
  );
}

// ================================================================
// § CIPHER SELECTOR — horizontal scroll strip
// ================================================================
const CipherSelector = memo(function CipherSelector({ active, onChange }) {
  const handleClick = useCallback(e => onChange(e.currentTarget.dataset.cipher), [onChange]);
  return (
    <div style={{
      display:        "flex",
      gap:            6,
      overflowX:      "auto",
      WebkitOverflowScrolling: "touch",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
      paddingBottom:  2,
    }}>
      {CIPHER_KEYS.map(k => {
        const { short, color } = CIPHERS[k];
        const on = active === k;
        return (
          <button key={k} data-cipher={k} onClick={handleClick} style={{
            padding:      "8px 14px",
            borderRadius: T.radius,
            border:       `1px solid ${on ? color : T.border}`,
            background:   on ? `${color}1a` : T.bg2,
            color:        on ? color : T.textMid,
            cursor:       "pointer",
            fontFamily:   "'Courier New', Courier, monospace",
            fontWeight:   700,
            fontSize:     12,
            flexShrink:   0,
            transition:   "border-color 0.12s, color 0.12s, background 0.12s",
          }}>{short}</button>
        );
      })}
    </div>
  );
});

// ================================================================
// § WORD SIMILARITY ENGINE
// ================================================================
/**
 * Find database entries whose cipher values are closest to the
 * clicked word across all 8 ciphers. Uses rankByCrossMatch with
 * the word's own values as the target — any phrase length allowed.
 */
function wordSimilar(word, indexes, k = 8) {
  if (!indexes) return [];
  const norm   = normalize(word);
  if (!norm) return [];
  const target = calcValues(norm);
  // Exclude exact self-matches
  const selfBucket = indexes.idx["simple"][target["simple"]] || [];
  const exactSet   = new Set(selfBucket.filter(e => e.norm === norm).map(e => e.id));
  // rankByCrossMatch only finds entries sharing at least one exact bucket value.
  // For words not in the database we fall back to nearest-per-cipher collection.
  let results = rankByCrossMatch(indexes, target, exactSet, k);
  if (results.length < k) {
    // Supplement with nearest values on the active ciphers
    const seen = new Set(results.map(e => e.id));
    seen.forEach(id => exactSet.add(id));
    for (const c of CIPHER_KEYS) {
      const nearest = nearestInIndex(indexes.idx, indexes.sortedVals, c, target[c], 4);
      for (const n of nearest) {
        for (const e of n.entries) {
          if (!seen.has(e.id) && !exactSet.has(e.id)) {
            results.push(e);
            seen.add(e.id);
          }
        }
      }
      if (results.length >= k) break;
    }
    results = results.slice(0, k);
  }
  return results;
}

// ================================================================
// § NAME READING ENGINE
// ================================================================

const VOWELS_NAME = new Set(["a","e","i","o","u","y"]);

/**
 * Parse a full name string into components for reading.
 * Returns: { first, last, full, vowels, consonants, initials,
 *            firstVal, lastVal, fullVal, vowelVal, consonantVal, initialsVal,
 *            firstDR, lastDR, fullDR, vowelDR, consonantDR, initialsDR }
 */
function parseName(raw) {
  const clean  = raw.trim().toLowerCase().replace(/[^a-z ]/g, "").replace(/\s+/g, " ");
  const parts  = clean.split(" ").filter(Boolean);
  if (!parts.length) return null;

  const first = parts[0] || "";
  const last  = parts.length > 1 ? parts[parts.length - 1] : "";
  const full  = parts.join("");

  // Extract vowels and consonants from full name (spaces excluded)
  let vowelStr = "", consonantStr = "";
  for (const ch of full) {
    if (VOWELS_NAME.has(ch)) vowelStr += ch;
    else consonantStr += ch;
  }

  // Initials
  const initialsStr = parts.map(p => p[0]).join("");

  // Simple ordinal sum A=1…Z=26
  function ordSum(s) {
    let t = 0;
    for (let i = 0; i < s.length; i++) {
      const cc = s.charCodeAt(i);
      if (cc >= 97 && cc <= 122) t += cc - 96;
    }
    return t;
  }

  const firstVal      = ordSum(first);
  const lastVal       = ordSum(last);
  const fullVal       = ordSum(full);
  const vowelVal      = ordSum(vowelStr);
  const consonantVal  = ordSum(consonantStr);
  const initialsVal   = ordSum(initialsStr);

  return {
    raw: raw.trim(),
    parts,
    first, last, full,
    vowels: vowelStr, consonants: consonantStr, initials: initialsStr,
    firstVal, lastVal, fullVal, vowelVal, consonantVal, initialsVal,
    firstDR:     digitalRoot(firstVal),
    lastDR:      digitalRoot(lastVal),
    fullDR:      digitalRoot(fullVal),
    vowelDR:     digitalRoot(vowelVal),
    consonantDR: digitalRoot(consonantVal),
    initialsDR:  digitalRoot(initialsVal),
  };
}

// The six components with their numerology labels
const NAME_COMPONENTS = [
  { key:"fullVal",      dr:"fullDR",      label:"Expression",  desc:"full name · all letters",     strKey:"full"       },
  { key:"vowelVal",     dr:"vowelDR",     label:"Soul Urge",   desc:"vowels only",                  strKey:"vowels"     },
  { key:"consonantVal", dr:"consonantDR", label:"Personality", desc:"consonants only",              strKey:"consonants" },
  { key:"firstVal",     dr:"firstDR",     label:"First",       desc:"first name",                   strKey:"first"      },
  { key:"lastVal",      dr:"lastDR",      label:"Last",        desc:"last name",                    strKey:"last"       },
  { key:"initialsVal",  dr:"initialsDR",  label:"Initials",    desc:"first letter of each part",    strKey:"initials"   },
];

const COMPONENT_COLORS = ["#38bdf8","#c084fc","#f472b6","#4ade80","#fb923c","#e879f9"];

// ================================================================
// § NAME PANEL
// ================================================================
function NamePanel({ indexes, copy, copiedId }) {
  const [input,   setInput]   = useState("");
  const [focused, setFocused] = useState(null); // which component to expand
  const debouncedInput = useDebounce(input, 100);

  const reading = useMemo(() => {
    const n = debouncedInput.trim();
    if (!n) return null;
    return parseName(n);
  }, [debouncedInput]);

  // For the focused component, find database matches by SE value
  const focusMatches = useMemo(() => {
    if (!reading || focused === null || !indexes) return [];
    const comp = NAME_COMPONENTS[focused];
    const val  = reading[comp.key];
    return (indexes.idx["simple"][val] || []).slice(0, 20);
  }, [reading, focused, indexes]);

  // Resonance: which components share values
  const resonance = useMemo(() => {
    if (!reading) return [];
    const pairs = [];
    for (let i = 0; i < NAME_COMPONENTS.length; i++) {
      for (let j = i + 1; j < NAME_COMPONENTS.length; j++) {
        if (reading[NAME_COMPONENTS[i].key] === reading[NAME_COMPONENTS[j].key]) {
          pairs.push({ i, j, val: reading[NAME_COMPONENTS[i].key] });
        }
      }
    }
    return pairs;
  }, [reading]);

  const handleChange  = useCallback(e => setInput(e.target.value), []);
  const handleFocus   = useCallback(e => {
    const idx = +e.currentTarget.dataset.idx;
    setFocused(f => f === idx ? null : idx);
  }, []);

  return (
    <Card>
      <SectionLabel>Name Reading</SectionLabel>
      <Inp
        value={input}
        onChange={handleChange}
        placeholder="enter a full name..."
        accentColor="#38bdf8"
        style={{ marginBottom: 12 }}
      />

      {reading && (
        <>
          {/* Name parts display */}
          <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:12 }}>
            {reading.parts.map((p, i) => (
              <span key={i} style={{
                padding:"3px 10px", borderRadius:6,
                background:"#38bdf808", border:"1px solid #38bdf833",
                fontSize:13, color:"#38bdf8", fontFamily:T.mono, fontWeight:700,
                letterSpacing:"0.08em", textTransform:"uppercase",
              }}>{p}</span>
            ))}
          </div>

          {/* Six component cards */}
          <div style={{ display:"grid", gap:8, marginBottom:12 }}>
            {NAME_COMPONENTS.map((comp, i) => {
              const val   = reading[comp.key];
              const dr    = reading[comp.dr];
              const str   = reading[comp.strKey];
              const color = COMPONENT_COLORS[i];
              const isActive = focused === i;
              const glows = resonance.some(r => r.i === i || r.j === i);

              return (
                <div key={comp.key}>
                  <button
                    data-idx={i}
                    onClick={handleFocus}
                    style={{
                      width:        "100%",
                      display:      "flex",
                      alignItems:   "center",
                      justifyContent: "space-between",
                      padding:      "10px 14px",
                      borderRadius: T.radius,
                      border:       `1px solid ${isActive ? color : glows ? "rgba(255,255,255,0.25)" : color+"33"}`,
                      background:   isActive ? `${color}12` : glows ? "rgba(255,255,255,0.05)" : T.bg2,
                      cursor:       "pointer",
                      textAlign:    "left",
                      boxShadow:    glows && !isActive ? "0 0 8px rgba(255,255,255,0.08)" : "none",
                    }}>
                    <div>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:3 }}>
                        <span style={{ fontSize:11, fontWeight:700, color, fontFamily:T.mono }}>
                          {comp.label}
                        </span>
                        <span style={{ fontSize:9, color:T.textDim }}>{comp.desc}</span>
                      </div>
                      <div style={{
                        fontSize:10, color:T.textMid, fontFamily:T.mono,
                        letterSpacing:"0.12em",
                      }}>{str.toUpperCase()}</div>
                    </div>
                    <div style={{ textAlign:"right", flexShrink:0 }}>
                      <div style={{
                        fontSize:22, fontWeight:900, color,
                        fontFamily:T.mono,
                        textShadow: glows ? `0 0 12px ${color}88` : "none",
                      }}>{val}</div>
                      <div style={{ fontSize:10, color:`${color}88`, fontFamily:T.mono }}>
                        /{dr}
                      </div>
                    </div>
                  </button>

                  {/* Expanded match list */}
                  {isActive && (
                    <div style={{
                      borderLeft:  `2px solid ${color}44`,
                      marginLeft:  8,
                      paddingLeft: 10,
                      marginTop:   4,
                      marginBottom:4,
                    }}>
                      {focusMatches.length === 0
                        ? <div style={{ fontSize:12, color:T.textDim, padding:"8px 0" }}>
                            No database matches for {val}
                          </div>
                        : focusMatches.map(e => (
                          <div key={e.id} style={{
                            display:"flex", justifyContent:"space-between",
                            alignItems:"center", padding:"7px 0",
                            borderBottom:`1px solid ${T.border}`,
                          }}>
                            <span style={{ fontSize:13, color:T.text }}>{e.raw}</span>
                            <CopyBtn text={e.raw} id={`nm-${e.id}`} copy={copy} copiedId={copiedId}/>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Resonance summary */}
          {resonance.length > 0 && (
            <div style={{
              background:   T.bg0,
              border:       "1px solid rgba(255,255,255,0.12)",
              borderRadius: T.radius,
              padding:      "10px 12px",
            }}>
              <div style={{ fontSize:10, color:T.textDim, marginBottom:6,
                letterSpacing:"0.08em", textTransform:"uppercase" }}>
                Resonance
              </div>
              {resonance.map(({ i, j, val }) => (
                <div key={`${i}-${j}`} style={{
                  display:"flex", alignItems:"center", gap:8,
                  marginBottom:4, flexWrap:"wrap",
                }}>
                  <span style={{
                    fontSize:11, fontWeight:700, color:COMPONENT_COLORS[i], fontFamily:T.mono,
                  }}>{NAME_COMPONENTS[i].label}</span>
                  <span style={{ color:T.textDim, fontSize:11 }}>↔</span>
                  <span style={{
                    fontSize:11, fontWeight:700, color:COMPONENT_COLORS[j], fontFamily:T.mono,
                  }}>{NAME_COMPONENTS[j].label}</span>
                  <span style={{
                    fontSize:10, color:"#ffffff", background:"rgba(255,255,255,0.1)",
                    border:"1px solid rgba(255,255,255,0.2)",
                    borderRadius:4, padding:"1px 8px", fontFamily:T.mono, fontWeight:700,
                  }}>{val}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Card>
  );
}

// ================================================================
// § GLYPH ENGINE — walk-as-signature visualization
// ================================================================

/**
 * 9 directions indexed by Pythagorean value (1-9).
 * 9 is treated as a "spiral" — rotates heading by 45°.
 */
const GLYPH_DIRS = [
  null,
  { dx:  0, dy: -1 },  // 1 N
  { dx:  1, dy: -1 },  // 2 NE
  { dx:  1, dy:  0 },  // 3 E
  { dx:  1, dy:  1 },  // 4 SE
  { dx:  0, dy:  1 },  // 5 S
  { dx: -1, dy:  1 },  // 6 SW
  { dx: -1, dy:  0 },  // 7 W
  { dx: -1, dy: -1 },  // 8 NW
  { dx:  0, dy:  0 },  // 9 spiral
];

/** Normalize direction vector to unit length */
function normDir(dx, dy) {
  const m = Math.sqrt(dx*dx + dy*dy) || 1;
  return { dx: dx/m, dy: dy/m };
}

/** Vowel → polygon side count: a=3, e=4, i=5, o=6, u=7, y=8 */
const VOWEL_SIDES = { a: 3, e: 4, i: 5, o: 6, u: 7, y: 8 };

/** Generate polygon vertices around a center point */
function polygonPoints(cx, cy, radius, sides, rotation = 0) {
  const pts = [];
  for (let i = 0; i < sides; i++) {
    const a = rotation + (i / sides) * Math.PI * 2 - Math.PI / 2;
    pts.push({ x: cx + Math.cos(a) * radius, y: cy + Math.sin(a) * radius });
  }
  return pts;
}

/**
 * Build walk-as-glyph geometry.
 * Vowels become polygons (3-8 sides based on which vowel).
 * Each consonant gets a main step PLUS a decorative flourish/tick.
 * Multi-word phrases radiate from a ring.
 */
// Sigmoid helper for positionFactor
function sigmoid(x) { return 1 / (1 + Math.exp(-x)); }

function buildGlyph(norm) {
  if (!norm || typeof norm !== "string") return null;
  const trimmed = norm.trim();
  if (!trimmed) return null;

  // Wrap entire engine in try/catch — never crash the component
  try {
  const words = trimmed.split(" ").filter(Boolean);
  const W = words.length;
  if (W === 0) return null;

  const segments    = [];
  const flourishes  = [];
  const vowelShapes = [];
  const signatureArcs = [];
  let gMinX = 0, gMinY = 0, gMaxX = 0, gMaxY = 0;

  const values       = calcValues(trimmed);
  const phraseSE     = values.simple   || 1;
  const phraseSH     = values.shadow   || 30;
  const phrasePR     = values.prime    || 2;
  const totalLetters = trimmed.replace(/ /g, "").length || 1;

  let totalVowelWeight = 0;
  for (const ch of trimmed) {
    if (VOWELS.has(ch)) totalVowelWeight += (ch.charCodeAt(0) - 96);
  }
  if (totalVowelWeight === 0) totalVowelWeight = 1; // avoid /0

  const shNorm     = Math.max(0, Math.min(1, (phraseSH - 30) / 350));
  const baseStroke = 0.35 + shNorm * 0.5;
  const auraStroke = 2.2  + shNorm * 1.2;
  const prNorm     = Math.max(0, Math.min(1, Math.log10(Math.max(phrasePR, 1)) / 3.5));
  const saturation = 62 + prNorm * 30;

  let maxWordLen = 1;
  for (const w of words) if (w.length > maxWordLen) maxWordLen = w.length;
  const ringRadius = W > 1 ? Math.max(4, maxWordLen * 0.8) : 0;

  for (let wi = 0; wi < W; wi++) {
    const word = words[wi];
    if (!word) continue;

    const wordAngle = (wi / W) * Math.PI * 2 - Math.PI / 2;
    let x = W > 1 ? Math.cos(wordAngle) * ringRadius : 0;
    let y = W > 1 ? Math.sin(wordAngle) * ringRadius : 0;
    const startX = x, startY = y;

    let lastDx = Math.cos(wordAngle);
    let lastDy = Math.sin(wordAngle);
    let spiralAngle = wordAngle;
    let prevPyth    = 0;
    let prevOrdinal = 0;
    let consecutiveSpirals = 0;

    const points = [{
      x, y, ch: null, simple: 0, pyth: 0, isVowel: false,
      isStart: true, wordIdx: wi, letterIdx: -1,
      strokeMod: 1, opacity: 0.6,
    }];

    const validLetters = [];
    for (let i = 0; i < word.length; i++) {
      const cc = word.charCodeAt(i);
      if (cc >= 97 && cc <= 122) validLetters.push(i);
    }
    const n = validLetters.length;

    for (let vi = 0; vi < n; vi++) {
      const i   = validLetters[vi];
      const ch  = word[i];
      const idx    = ch.charCodeAt(0) - 97;
      const simple = idx + 1;
      const pyth   = PYTH_MAP[idx];
      const prime  = PRIME_MAP[idx];
      const isVowel = VOWELS.has(ch);

      // Sigmoid positionFactor — expansion centered on word midpoint
      const posFactor = 1 + 0.4 * sigmoid((vi - n / 2) / Math.max(n, 1));
      // Pairwise step length modulation
      const pairMult  = 1 + (prevOrdinal % 3) * 0.05;
      const rawStep   = Math.sqrt(simple) * 1.15 * posFactor * pairMult;
      const stepLen   = isFinite(rawStep) && rawStep > 0 ? rawStep : 1;
      // Opacity gradient: 60% at start → 100% at end
      const opacity   = n > 1 ? 0.6 + (vi / (n - 1)) * 0.4 : 1;

      let dx, dy;

      if (pyth === 9) {
        consecutiveSpirals++;
        const spiralDelta   = (Math.PI / 4) + (simple % 5) * (Math.PI / 30);
        const cumulative    = consecutiveSpirals > 1 ? (consecutiveSpirals - 1) * Math.PI / 12 : 0;
        spiralAngle += spiralDelta + cumulative;
        dx = Math.cos(spiralAngle);
        dy = Math.sin(spiralAngle);
      } else {
        consecutiveSpirals = 0;
        const dir = GLYPH_DIRS[pyth];
        const nd  = normDir(dir.dx, dir.dy);
        dx = nd.dx; dy = nd.dy;

        // Pairwise angle influence: Δangle += (currentPY − prevPY) × 2°
        if (prevPyth > 0) {
          const dAngle = (pyth - prevPyth) * (Math.PI / 90);
          const cur    = Math.atan2(dy, dx);
          dx = Math.cos(cur + dAngle);
          dy = Math.sin(cur + dAngle);
        }

        if (isVowel) {
          // Prime-modulated blend ratio: 0.4 + (prime % 5) × 0.1
          const blend = 0.4 + (prime % 5) * 0.1;
          dx = dx * blend + lastDx * (1 - blend);
          dy = dy * blend + lastDy * (1 - blend);
          const nb = normDir(dx, dy);
          dx = nb.dx; dy = nb.dy;
        }

        spiralAngle = Math.atan2(dy, dx);
      }

      // Angle change for adaptive smoothing and curvature stroke mod
      const angleChange = Math.abs(Math.atan2(
        dx * lastDy - dy * lastDx,
        dx * lastDx + dy * lastDy
      ));
      const hardCorner = angleChange > (70 * Math.PI / 180);
      const strokeMod  = 1 - (angleChange / Math.PI) * 0.2;

      const prevX = x, prevY = y;
      x += dx * stepLen;
      y += dy * stepLen;
      lastDx = dx; lastDy = dy;
      prevPyth    = pyth;
      prevOrdinal = simple;

      points.push({
        x, y, ch, simple, pyth, prime, isVowel, isStart: false,
        wordIdx: wi, letterIdx: vi,
        prevX, prevY,
        hardCorner, strokeMod, opacity,
        isPulse: vi > 0 && vi % 3 === 0,
      });

      if (isVowel) {
        const sides        = VOWEL_SIDES[ch] || 4;
        const weightRatio  = totalVowelWeight > 0 ? simple / totalVowelWeight : 0.5;
        const contextScale = 0.7 + Math.pow(Math.max(weightRatio, 0), 0.6);
        const radius       = Math.max(0.5, (0.8 + Math.sqrt(simple) * 0.25) * contextScale);
        vowelShapes.push({
          cx: x, cy: y, sides, radius, rotation: spiralAngle,
          simple, prime, ch,
          pointIdx: points.length - 1,
          segIdx: segments.length,
        });
      } else {
        // Tick count: floor(1 + log2(PY + 1)) — logarithmic 1–4
        const tickCount = Math.floor(1 + Math.log2(pyth + 1));
        // Tick angle offset: (shadowValue % 3) × 5°
        const tickOffset = ((phraseSH % 3) * 5) * (Math.PI / 180);
        const perpAngle  = Math.atan2(dx, -dy) + tickOffset;
        const perpDx = Math.cos(perpAngle), perpDy = Math.sin(perpAngle);
        const tickLen    = 0.6 + Math.sqrt(simple) * 0.08;

        for (let t = 0; t < tickCount; t++) {
          const off  = 0.25 + (t / Math.max(tickCount - 1, 1)) * 0.45;
          const fx   = prevX + dx * stepLen * off;
          const fy   = prevY + dy * stepLen * off;
          const side = t % 2 === 0 ? 1 : -1;
          flourishes.push({
            x1: fx, y1: fy,
            x2: fx + perpDx * tickLen * 0.5 * side,
            y2: fy + perpDy * tickLen * 0.5 * side,
            simple, segIdx: segments.length, opacity,
          });
        }
        if (simple >= 18) {
          flourishes.push({
            type: "arc",
            cx: x - dx * 0.8, cy: y - dy * 0.8,
            r: 0.35, simple, segIdx: segments.length, opacity,
          });
        }
      }

      if (x < gMinX) gMinX = x;
      if (y < gMinY) gMinY = y;
      if (x > gMaxX) gMaxX = x;
      if (y > gMaxY) gMaxY = y;
    }

    segments.push({
      word, points, startX, startY, endX: x, endY: y,
      endDx: lastDx, endDy: lastDy,
    });

    // Signature arc: faint radial arc at word ring origin
    signatureArcs.push({
      cx: startX, cy: startY,
      radius:  Math.max(2, Math.sqrt(phraseSE) * 0.4),
      arcSpan: n * 6 * (Math.PI / 180),
      angle:   wordAngle,
      wordIdx: wi,
    });
  }

  // Word-to-word connections
  const wordConnections = [];
  if (W > 1) {
    for (let i = 0; i < segments.length; i++) {
      const a = segments[i], b = segments[(i + 1) % segments.length];
      wordConnections.push({ x1: a.endX, y1: a.endY, x2: b.startX, y2: b.startY });
    }
  }

  // Closing path — adaptive threshold = 8% + 1/√letterCount
  let closingLine = null;
  if (segments.length > 0) {
    const first = segments[0], last = segments[segments.length - 1];
    const cdx = last.endX - first.startX, cdy = last.endY - first.startY;
    const dist     = Math.sqrt(cdx*cdx + cdy*cdy);
    const diagonal = Math.sqrt(Math.pow(gMaxX-gMinX,2)+Math.pow(gMaxY-gMinY,2)) || 1;
    const threshold = 0.08 + 1 / Math.sqrt(Math.max(totalLetters, 1));
    if (dist / diagonal < threshold && dist > 0.5) {
      closingLine = { x1: last.endX, y1: last.endY, x2: first.startX, y2: first.startY };
    }
  }

  // Vowel polygon bounds expansion
  for (const v of vowelShapes) {
    gMinX = Math.min(gMinX, v.cx - v.radius);
    gMinY = Math.min(gMinY, v.cy - v.radius);
    gMaxX = Math.max(gMaxX, v.cx + v.radius);
    gMaxY = Math.max(gMaxY, v.cy + v.radius);
  }

  const centerX = (gMinX + gMaxX) / 2;
  const centerY = (gMinY + gMaxY) / 2;

  const contentW = gMaxX - gMinX;
  const contentH = gMaxY - gMinY;
  const contentRadius = Math.max(
    Math.sqrt(contentW * contentW + contentH * contentH) / 2,
    3  // minimum so single-letter glyphs still have a visible frame
  );
  const frameRadius   = contentRadius * (1.15 + Math.min(totalLetters / 30, 0.35));
  const innerRadius   = Math.max(0.8, Math.min(contentRadius * 0.15, Math.sqrt(phraseSE) * 0.25));
  const padding = Math.max(6, frameRadius * 0.15);
  const width   = Math.max(20, (frameRadius + padding) * 2);
  const height  = Math.max(20, (frameRadius + padding) * 2);
  const minX    = centerX - frameRadius - padding;
  const minY    = centerY - frameRadius - padding;

  // Symmetry detection — adaptive threshold
  let symmetryAxis = null;
  if (totalLetters >= 3) {
    const allPts = [];
    for (const seg of segments)
      for (const p of seg.points)
        if (!p.isStart) allPts.push({ x: p.x - centerX, y: p.y - centerY });
    let bestScore = Infinity, bestAngle = 0;
    for (let k = 0; k < 12; k++) {
      const a = (k / 12) * Math.PI;
      const axNx = -Math.sin(a), axNy = Math.cos(a);
      let total = 0;
      for (const p of allPts) {
        const dot = p.x*axNx + p.y*axNy;
        const rx = p.x - 2*dot*axNx, ry = p.y - 2*dot*axNy;
        let minD = Infinity;
        for (const q of allPts) {
          const d = (q.x-rx)*(q.x-rx)+(q.y-ry)*(q.y-ry);
          if (d < minD) minD = d;
        }
        total += Math.sqrt(minD);
      }
      if (total < bestScore) { bestScore = total; bestAngle = a; }
    }
    const avgDist   = bestScore / allPts.length;
    const symThresh = contentRadius * (0.08 + 1/Math.sqrt(Math.max(totalLetters,1)));
    if (avgDist < symThresh) {
      symmetryAxis = {
        angle: bestAngle, strength: 1 - (avgDist / symThresh),
        cx: centerX, cy: centerY, length: frameRadius * 1.1,
      };
    }
  }

  // Build smooth paths — adaptive corner sharpness
  for (const seg of segments) {
    const pts = seg.points;
    if (pts.length < 2) { seg.path = ""; continue; }
    let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
    for (let i = 1; i < pts.length; i++) {
      const p = pts[i], prev = pts[i-1];
      if (i === 1) {
        d += ` L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
      } else if (p.hardCorner) {
        d += ` L ${prev.x.toFixed(2)} ${prev.y.toFixed(2)} L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
      } else {
        const mx = (prev.x+p.x)/2, my = (prev.y+p.y)/2;
        d += ` Q ${prev.x.toFixed(2)} ${prev.y.toFixed(2)} ${mx.toFixed(2)} ${my.toFixed(2)}`;
      }
    }
    d += ` L ${pts[pts.length-1].x.toFixed(2)} ${pts[pts.length-1].y.toFixed(2)}`;
    seg.path = d;
  }

  // Self-intersections
  const crossings = [];
  for (const seg of segments) {
    const pts = seg.points;
    for (let i = 1; i < pts.length; i++)
      for (let j = i+2; j < pts.length; j++) {
        const c = segmentsIntersect(
          pts[i-1].x, pts[i-1].y, pts[i].x, pts[i].y,
          pts[j-1].x, pts[j-1].y, pts[j].x, pts[j].y
        );
        if (c) crossings.push(c);
      }
  }

  return {
    segments, flourishes, vowelShapes, crossings, signatureArcs, W,
    minX, minY, width, height, centerX, centerY,
    frameRadius, innerRadius,
    baseStroke, auraStroke, saturation,
    wordConnections, closingLine, symmetryAxis,
    phraseSE, phraseSH, phrasePR, totalLetters,
  };
  } catch (e) {
    console.error("buildGlyph error:", e);
    return null;
  }
}


/** Line segment intersection test — returns intersection point or null */
function segmentsIntersect(x1,y1, x2,y2, x3,y3, x4,y4) {
  const d = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4);
  if (Math.abs(d) < 1e-9) return null;
  const t = ((x1-x3)*(y3-y4) - (y1-y3)*(x3-x4)) / d;
  const u = -((x1-x2)*(y1-y3) - (y1-y2)*(x1-x3)) / d;
  if (t < 0.02 || t > 0.98 || u < 0.02 || u > 0.98) return null;
  return { x: x1 + t*(x2-x1), y: y1 + t*(y2-y1) };
}

/** Letter color — hue = ((ordinal-1)×14 + prime×9) mod 360, saturation driven by PR */
function letterColor(simple, alpha = 1, saturation = 78) {
  const prime = PRIME_MAP[simple - 1] || 2;
  const hue = ((simple - 1) * 14 + prime * 9) % 360;
  return `hsla(${hue}, ${saturation}%, 62%, ${alpha})`;
}

// ================================================================
// § GLYPH PANEL
// ================================================================
function getTwoFingerState(touches) {
  if (!touches || touches.length < 2) return null;
  const dx = touches[1].clientX - touches[0].clientX;
  const dy = touches[1].clientY - touches[0].clientY;
  return { dist: Math.sqrt(dx*dx+dy*dy), angle: Math.atan2(dy,dx) };
}

function GlyphPanel({ copy, copiedId }) {
  const [input,    setInput]    = useState("");
  const [tx,       setTx]       = useState(0);
  const [ty,       setTy]       = useState(0);
  const [scale,    setScale]    = useState(1);
  const [rot,      setRot]      = useState(0);
  const [selected, setSelected] = useState(null);
  const gestureRef = useRef({
    mode:null, startX:0, startY:0, startTx:0, startTy:0,
    startDist:1, startScale:1, startAngle:0, startRot:0, moved:false,
  });

  const debouncedInput = useDebounce(input, 120);
  const norm   = useMemo(() => normalize(debouncedInput), [debouncedInput]);
  const glyph  = useMemo(() => buildGlyph(norm), [norm]);
  const values = useMemo(() => norm ? calcValues(norm) : null, [norm]);
  const totalLetters = useMemo(() => {
    if (!glyph) return 0;
    let n = 0;
    for (const s of glyph.segments) n += s.points.length - 1;
    return n;
  }, [glyph]);

  useEffect(() => {
    setTx(0); setTy(0); setScale(1); setRot(0); setSelected(null);
  }, [norm]);

  const handleChange     = useCallback(e => setInput(e.target.value), []);
  const handleReset      = useCallback(() => { setTx(0); setTy(0); setScale(1); setRot(0); setSelected(null); }, []);
  const handlePointerEnd = useCallback(() => { gestureRef.current.mode = null; }, []);
  const handleWheel      = useCallback(e => {
    e.preventDefault();
    setScale(s => Math.max(0.3, Math.min(5, s * (e.deltaY < 0 ? 1.1 : 0.9))));
  }, []);
  const handleLetterTap  = useCallback((si, pi, pt) => {
    if (gestureRef.current.moved) return;
    setSelected(sel => sel && sel.segIdx === si && sel.ptIdx === pi ? null : { segIdx:si, ptIdx:pi, ...pt });
  }, []);
  const handlePointerStart = useCallback(e => {
    const g = gestureRef.current; g.moved = false;
    if (e.touches && e.touches.length === 2) {
      const ts = getTwoFingerState(e.touches);
      g.mode="pinch"; g.startDist=ts.dist; g.startAngle=ts.angle;
      g.startScale=scale; g.startRot=rot; e.preventDefault();
    } else {
      const p = e.touches ? e.touches[0] : e;
      g.mode="pan"; g.startX=p.clientX; g.startY=p.clientY; g.startTx=tx; g.startTy=ty;
    }
  }, [tx, ty, scale, rot]);
  const handlePointerMove = useCallback(e => {
    const g = gestureRef.current; if (!g.mode) return;
    if (g.mode === "pinch" && e.touches && e.touches.length === 2) {
      const ts = getTwoFingerState(e.touches);
      setScale(Math.max(0.3, Math.min(5, g.startScale * (ts.dist / g.startDist))));
      setRot(g.startRot + (ts.angle - g.startAngle));
      g.moved = true; e.preventDefault();
    } else if (g.mode === "pan") {
      const p = e.touches ? e.touches[0] : e;
      const dx = p.clientX - g.startX, dy = p.clientY - g.startY;
      if (Math.abs(dx) + Math.abs(dy) > 3) g.moved = true;
      setTx(g.startTx + dx); setTy(g.startTy + dy);
    }
  }, []);

  const showLabels = totalLetters > 0 && totalLetters <= 10;
  const sat  = (glyph && isFinite(glyph.saturation)) ? glyph.saturation : 78;
  const gW   = (glyph && glyph.width  > 0) ? glyph.width  : 360;
  const gH   = (glyph && glyph.height > 0) ? glyph.height : 360;
  const gCX  = (glyph && isFinite(glyph.centerX)) ? glyph.centerX : 0;
  const gCY  = (glyph && isFinite(glyph.centerY)) ? glyph.centerY : 0;
  const svgT = glyph
    ? "translate(" + (tx*(gW/360)) + " " + (ty*(gH/360)) + ") "
    + "rotate(" + (rot*180/Math.PI) + " " + gCX + " " + gCY + ") "
    + "translate(" + (gCX*(1-scale)) + " " + (gCY*(1-scale)) + ") "
    + "scale(" + scale + ")"
    : "";
  const selPt = (selected && glyph) ? glyph.segments[selected.segIdx]?.points[selected.ptIdx] : null;

  return (
    <Card>
      <SectionLabel>Glyph</SectionLabel>
      <Inp value={input} onChange={handleChange}
        placeholder="enter word or phrase..."
        accentColor="#e879f9" style={{ marginBottom:14 }}/>
      {glyph && norm && (
        <>
          <div style={{
            width:"100%", aspectRatio:"1/1",
            background:"radial-gradient(circle at center, #0a0a14 0%, #000000 70%)",
            border:`1px solid ${T.border}`, borderRadius:T.radiusLg,
            overflow:"hidden", marginBottom:12, position:"relative", touchAction:"none",
          }}
            onMouseDown={handlePointerStart} onMouseMove={handlePointerMove}
            onMouseUp={handlePointerEnd} onMouseLeave={handlePointerEnd}
            onTouchStart={handlePointerStart} onTouchMove={handlePointerMove}
            onTouchEnd={handlePointerEnd} onWheel={handleWheel}>
            <svg
              viewBox={`${glyph.minX} ${glyph.minY} ${glyph.width} ${glyph.height}`}
              preserveAspectRatio="xMidYMid meet"
              style={{ width:"100%", height:"100%", display:"block", cursor:"grab" }}>
              <defs>
                <filter id="gl-glow" x="-40%" y="-40%" width="180%" height="180%">
                  <feGaussianBlur stdDeviation="0.5" result="b"/>
                  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="gl-aura" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="2.2"/>
                </filter>
                {glyph.segments.map((seg, si) => {
                  const fa = seg.points[1]?.simple || 13;
                  const la = seg.points[seg.points.length-1]?.simple || 13;
                  return (
                    <linearGradient key={`g${si}`} id={`pg${si}`}
                      x1={seg.startX} y1={seg.startY} x2={seg.endX} y2={seg.endY}
                      gradientUnits="userSpaceOnUse">
                      <stop offset="0%"   stopColor={letterColor(fa, 1, sat)}/>
                      <stop offset="100%" stopColor={letterColor(la, 1, sat)}/>
                    </linearGradient>
                  );
                })}
              </defs>
              <g transform={svgT}>
                <circle cx={glyph.centerX} cy={glyph.centerY} r={glyph.frameRadius}
                  fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.15"/>
                <circle cx={glyph.centerX} cy={glyph.centerY} r={glyph.frameRadius*0.92}
                  fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.12" strokeDasharray="0.8 1.2"/>
                <circle cx={glyph.centerX} cy={glyph.centerY} r={glyph.innerRadius}
                  fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.2" strokeDasharray="0.4 0.4"/>
                <circle cx={glyph.centerX} cy={glyph.centerY} r="0.25" fill="rgba(255,255,255,0.35)"/>
                {glyph.symmetryAxis && (
                  <line
                    x1={glyph.symmetryAxis.cx - Math.cos(glyph.symmetryAxis.angle)*glyph.symmetryAxis.length}
                    y1={glyph.symmetryAxis.cy - Math.sin(glyph.symmetryAxis.angle)*glyph.symmetryAxis.length}
                    x2={glyph.symmetryAxis.cx + Math.cos(glyph.symmetryAxis.angle)*glyph.symmetryAxis.length}
                    y2={glyph.symmetryAxis.cy + Math.sin(glyph.symmetryAxis.angle)*glyph.symmetryAxis.length}
                    stroke={`rgba(255,255,255,${0.1+glyph.symmetryAxis.strength*0.25})`}
                    strokeWidth="0.18" strokeDasharray="1.2 0.8"/>
                )}
                {glyph.closingLine && (
                  <line x1={glyph.closingLine.x1} y1={glyph.closingLine.y1}
                    x2={glyph.closingLine.x2} y2={glyph.closingLine.y2}
                    stroke="rgba(255,255,255,0.25)" strokeWidth="0.2" strokeDasharray="0.6 0.4"/>
                )}
                {glyph.wordConnections.map((wc, i) => (
                  <line key={`wc${i}`} x1={wc.x1} y1={wc.y1} x2={wc.x2} y2={wc.y2}
                    stroke="rgba(255,255,255,0.08)" strokeWidth="0.12" strokeDasharray="0.3 0.5"/>
                ))}

                {/* Signature arcs — faint radial arcs at each word origin */}
                {glyph.signatureArcs.map((arc, i) => {
                  const a0 = arc.angle - arc.arcSpan / 2;
                  const a1 = arc.angle + arc.arcSpan / 2;
                  const x0 = arc.cx + Math.cos(a0) * arc.radius;
                  const y0 = arc.cy + Math.sin(a0) * arc.radius;
                  const x1 = arc.cx + Math.cos(a1) * arc.radius;
                  const y1 = arc.cy + Math.sin(a1) * arc.radius;
                  const largeArc = arc.arcSpan > Math.PI ? 1 : 0;
                  return (
                    <path key={`sa${i}`}
                      d={`M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${arc.radius.toFixed(2)} ${arc.radius.toFixed(2)} 0 ${largeArc} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`}
                      fill="none"
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="0.18"
                      strokeLinecap="round"
                    />
                  );
                })}
                {glyph.segments.map((seg, si) => (
                  <path key={`au${si}`} d={seg.path} fill="none"
                    stroke={`url(#pg${si})`} strokeWidth={glyph.auraStroke}
                    strokeLinecap="round" strokeLinejoin="round" opacity="0.25" filter="url(#gl-aura)"/>
                ))}
                {glyph.segments.map((seg, si) => (
                  <path key={`mp${si}`} d={seg.path} fill="none"
                    stroke={`url(#pg${si})`} strokeWidth={glyph.baseStroke}
                    strokeLinecap="round" strokeLinejoin="round" opacity="0.9" filter="url(#gl-glow)"/>
                ))}
                {glyph.crossings.map((cr, i) => (
                  <circle key={`cr${i}`} cx={cr.x} cy={cr.y} r="0.5"
                    fill="#ffffff" opacity="0.4" filter="url(#gl-glow)"/>
                ))}
                {glyph.flourishes.map((fl, i) => fl.type === "arc"
                  ? <circle key={`fa${i}`} cx={fl.cx} cy={fl.cy} r={fl.r} fill="none"
                      stroke={letterColor(fl.simple, 0.7, sat)} strokeWidth="0.15" opacity="0.7"/>
                  : <line key={`ft${i}`} x1={fl.x1} y1={fl.y1} x2={fl.x2} y2={fl.y2}
                      stroke={letterColor(fl.simple, 0.6, sat)} strokeWidth="0.2"
                      strokeLinecap="round" opacity="0.7"/>
                )}
                {glyph.vowelShapes.map((v, i) => {
                  const vp = polygonPoints(v.cx, v.cy, v.radius, v.sides, v.rotation);
                  const ps = vp.map(pt => `${pt.x.toFixed(2)},${pt.y.toFixed(2)}`).join(" ");
                  const vc = letterColor(v.simple, 1, sat);
                  const vf = letterColor(v.simple, 0.1, sat);
                  return (
                    <g key={`vp${i}`}>
                      <polygon points={ps} fill={vf} stroke={vc}
                        strokeWidth="0.22" strokeLinejoin="round" filter="url(#gl-glow)"/>
                      {vp.map((vpt, j) => (
                        <line key={`vl${i}${j}`} x1={v.cx} y1={v.cy} x2={vpt.x} y2={vpt.y}
                          stroke={vc} strokeWidth="0.12" opacity="0.4"/>
                      ))}
                      <circle cx={v.cx} cy={v.cy} r="0.25" fill={vc}/>
                    </g>
                  );
                })}
                {glyph.segments.map((seg, si) => (
                  <g key={`lp${si}`}>
                    {seg.points.map((p, i) => {
                      const isSel = selected && selected.segIdx === si && selected.ptIdx === i;
                      if (p.isStart) {
                        const nxt = seg.points[1];
                        const sc  = (nxt && !nxt.isStart) ? letterColor(nxt.simple, 0.9, sat) : "#ffffff";
                        return (
                          <g key={`sp${si}${i}`}>
                            <circle cx={p.x} cy={p.y} r="1.2" fill="none" stroke={sc} strokeWidth="0.3" opacity="0.8"/>
                            <circle cx={p.x} cy={p.y} r="0.35" fill={sc} opacity="0.9"/>
                          </g>
                        );
                      }
                      const pc  = letterColor(p.simple, 1, sat);
                      const hit = (
                        <circle cx={p.x} cy={p.y} r="2.5" fill="transparent" style={{ cursor:"pointer" }}
                          onClick={e => { e.stopPropagation(); handleLetterTap(si, i, p); }}
                          onTouchEnd={e => { e.stopPropagation(); handleLetterTap(si, i, p); }}/>
                      );
                      if (p.isVowel) return (
                        <g key={`vv${si}${i}`}>
                          {isSel && <circle cx={p.x} cy={p.y} r="2.8" fill="none"
                            stroke="#ffffff" strokeWidth="0.25" opacity="0.95"/>}
                          {hit}
                        </g>
                      );
                      return (
                        <g key={`cc${si}${i}`}>
                          {/* Pulse marker every 3 letters */}
                          {p.isPulse && (
                            <circle cx={p.x} cy={p.y} r="1.6"
                              fill="none" stroke={pc}
                              strokeWidth="0.15" opacity="0.35"/>
                          )}
                          {isSel && <circle cx={p.x} cy={p.y} r="2.2" fill="none"
                            stroke="#ffffff" strokeWidth="0.2" opacity="0.9"/>}
                          <circle cx={p.x} cy={p.y}
                            r={0.5 + (p.strokeMod ?? 1) * 0.2}
                            fill={pc} opacity={p.opacity ?? 0.85} filter="url(#gl-glow)"/>
                          {hit}
                        </g>
                      );
                    })}
                  </g>
                ))}
                {glyph.segments.map((seg, si) => {
                  const pts = seg.points;
                  if (pts.length < 2) return null;
                  const lp = pts[pts.length-1], pp = pts[pts.length-2];
                  const ddx = lp.x-pp.x, ddy = lp.y-pp.y;
                  const ld  = Math.sqrt(ddx*ddx+ddy*ddy) || 1;
                  const ux = ddx/ld, uy = ddy/ld, px = -uy, py = ux;
                  return (
                    <polygon key={`ev${si}`}
                      points={`${lp.x+ux*1.4},${lp.y+uy*1.4} ${lp.x+px*0.45},${lp.y+py*0.45} ${lp.x-px*0.45},${lp.y-py*0.45}`}
                      fill={letterColor(lp.simple, 0.95, sat)} opacity="0.8" filter="url(#gl-glow)"/>
                  );
                })}
                {showLabels && glyph.segments.map((seg, si) => (
                  <g key={`lb${si}`}>
                    {seg.points.map((p, i) => {
                      if (p.isStart || !p.ch) return null;
                      return (
                        <text key={`lt${si}${i}`} x={p.x} y={p.y-2.3}
                          fontSize="1.7" fontFamily="monospace"
                          fill="rgba(255,255,255,0.6)" fontWeight="700" textAnchor="middle">
                          {p.ch.toUpperCase()}
                        </text>
                      );
                    })}
                  </g>
                ))}
              </g>
            </svg>
            <button onClick={handleReset} style={{
              position:"absolute", top:8, right:8, background:"rgba(0,0,0,0.6)",
              border:`1px solid ${T.border2}`, borderRadius:6, color:T.textMid,
              cursor:"pointer", fontSize:11, padding:"4px 10px",
              fontFamily:T.mono, backdropFilter:"blur(4px)"}}>reset</button>
            {(scale !== 1 || rot !== 0 || tx !== 0 || ty !== 0) && (
              <div style={{ position:"absolute", bottom:8, left:8,
                background:"rgba(0,0,0,0.6)", border:`1px solid ${T.border}`,
                borderRadius:6, color:T.textDim, fontSize:10,
                padding:"3px 8px", fontFamily:T.mono, backdropFilter:"blur(4px)" }}>
                {scale.toFixed(2)}x · {Math.round(rot*180/Math.PI)}°
              </div>
            )}
            {selPt && selPt.ch && !selPt.isStart && (
              <div style={{ position:"absolute", bottom:8, right:8,
                background:"rgba(0,0,0,0.8)",
                border:`1px solid ${letterColor(selPt.simple, 1, sat)}`,
                borderRadius:T.radius, color:T.text, padding:"8px 12px",
                fontFamily:T.mono, fontSize:11, backdropFilter:"blur(4px)", minWidth:110 }}>
                <div style={{ fontSize:22, fontWeight:900,
                  color:letterColor(selPt.simple, 1, sat), marginBottom:2 }}>
                  {selPt.ch.toUpperCase()}
                </div>
                <div style={{ color:T.textMid, fontSize:10, marginBottom:1 }}>
                  SE <span style={{color:T.text}}>{selPt.simple}</span> ·
                  PY <span style={{color:T.text}}>{selPt.pyth}</span>
                </div>
                <div style={{ color:T.textDim, fontSize:9 }}>
                  word {selPt.wordIdx+1} · pos {(selPt.letterIdx??0)+1}
                  {selPt.isVowel && " · vowel"}
                </div>
              </div>
            )}
          </div>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginBottom:6,
            fontSize:10, color:T.textDim, fontFamily:T.mono }}>
            <span>◉ start</span><span>⬠ vowel</span>
            <span>· consonant</span><span>⫽ flourish</span>
            <span>◆ end</span><span>∙ crossing</span>
          </div>
          <div style={{ fontSize:10, color:T.textDim, fontFamily:T.mono, marginBottom:10 }}>
            drag · pinch zoom · pinch rotate · tap letter
          </div>
          {values && (
            <div style={{ background:T.bg0, border:`1px solid ${T.border}`,
              borderRadius:T.radius, padding:"10px 12px" }}>
              <div style={{ display:"flex", justifyContent:"space-between",
                alignItems:"center", marginBottom:6 }}>
                <span style={{ fontSize:10, color:T.textDim }}>cipher values</span>
                <CopyBtn text={CIPHER_KEYS.map(c => `${CIPHERS[c].short}:${values[c]}`).join(" ")}
                  id="glyph-vals" copy={copy} copiedId={copiedId}/>
              </div>
              <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
                {CIPHER_KEYS.map(c => (<ValueBadge key={c} cipher={c} value={values[c]} showRoot/>))}
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
}

/**
 * Builds dataset + indexes in an inline blob Web Worker so the main
 * thread never blocks during startup. Falls back to synchronous build
 * if Workers are unavailable.
 */
function useIndexes(phrases) {
  const [state, setState] = useState({ indexes: null, entries: [], count: 0, loading: true });

  useEffect(() => {
    // Serialize the functions the worker needs
    const workerSrc = `
      ${normalize.toString()}
      ${letterCount.toString()}
      ${wordCount.toString()}
      ${VOWELS.toString().replace("new Set", "const VOWELS=new Set")}
      ${ciphersFused.toString()}
      ${cipherWeighted.toString()}
      ${cipherShadowEclipse.toString()}
      ${calcValues.toString()}
      ${buildDataset.toString()}
      ${buildIndexes.toString()}
      const PHRASE_CAT_MAP = new Map(${JSON.stringify([...PHRASE_CAT_MAP.entries()])});
      const CATEGORIES = ${JSON.stringify(CATEGORIES)};
      const CIPHER_KEYS = ${JSON.stringify(CIPHER_KEYS)};
      self.onmessage = function(e) {
        const phrases = e.data;
        const entries = buildDataset(phrases);
        const indexes = buildIndexes(entries);
        self.postMessage({ entries, indexes });
      };
    `;

    let worker;
    try {
      const blob = new Blob([workerSrc], { type: "application/javascript" });
      const url  = URL.createObjectURL(blob);
      worker = new Worker(url);
      worker.onmessage = ev => {
        URL.revokeObjectURL(url);
        setState({ indexes: ev.data.indexes, entries: ev.data.entries, count: ev.data.entries.length, loading: false });
      };
      worker.onerror = () => {
        URL.revokeObjectURL(url);
        const entries = buildDataset(phrases);
        setState({ indexes: buildIndexes(entries), entries, count: entries.length, loading: false });
      };
      worker.postMessage(phrases);
    } catch {
      const entries = buildDataset(phrases);
      setState({ indexes: buildIndexes(entries), entries, count: entries.length, loading: false });
    }

    return () => { if (worker) worker.terminate(); };
  }, []); // phrases is SEED_PHRASES — module-level constant, never changes

  return state;
}
/**
 * Rank db entries against a target value map using only index buckets.
 * Score = (exact cipher matches × 1000) + Σ 1/(1 + |entry_val − target_val|)
 * Only entries that appear in at least one cipher bucket are considered — O(hits×6).
 */
function rankByCrossMatch(indexes, targetValues, exactSet, k = 3) {
  const seen    = new Set();
  const scoring = new Map(); // id → { e, exactCount, proximity }
  // Collect candidates from index buckets only
  for (const c of CIPHER_KEYS) {
    const bucket = indexes.idx[c][targetValues[c]] || [];
    for (const e of bucket) {
      if (exactSet && exactSet.has(e.id)) continue;
      if (!scoring.has(e.id)) scoring.set(e.id, { e, exactCount:0, proximity:0 });
    }
  }
  // Score each candidate across all ciphers
  for (const [, s] of scoring) {
    for (const c of CIPHER_KEYS) {
      const diff = Math.abs(s.e.values[c] - targetValues[c]);
      if (diff === 0) s.exactCount++;
      else s.proximity += 1 / (1 + diff);
    }
  }
  const arr = [...scoring.values()];
  arr.sort((a, b) => (b.exactCount * 1000 + b.proximity) - (a.exactCount * 1000 + a.proximity));
  return arr.slice(0, k).map(s => s.e);
}

// ================================================================
// § LOOKUP PANEL
// ================================================================
const WC_FILTERS = [1, 2, 3, 4, 5];

function LookupPanel({ indexes, activeCipher, copy, copiedId, onHistoryPush }) {
  const [input,      setInput]      = useState("");
  const [numInput,   setNumInput]   = useState("");
  const [wcFilter,   setWcFilter]   = useState(0);
  const [catFilter,  setCatFilter]  = useState(new Set()); // empty = all
  const [swapWord,   setSwapWord]   = useState(null);
  const debouncedInput    = useDebounce(input, 80);
  const debouncedNumInput = useDebounce(numInput, 80);
  const ac = CIPHERS[activeCipher];

  const norm = useMemo(() => normalize(debouncedInput), [debouncedInput]);
  const computed = useMemo(() => {
    if (!norm) return null;
    return { values: calcValues(norm), wc: wordCount(norm), lc: letterCount(norm) };
  }, [norm]);

  // Combined filter: word count + category
  const filterEntries = useCallback((arr) => {
    let out = arr;
    if (wcFilter > 0) {
      out = wcFilter === 6 ? out.filter(e => e.wc >= 5) : out.filter(e => e.wc === wcFilter);
    }
    if (catFilter.size > 0 && indexes) {
      // Build union of allowed ids across selected categories
      const allowed = new Set();
      for (const cat of catFilter) {
        const ids = indexes.catIdx[cat];
        if (ids) for (const id of ids) allowed.add(id);
      }
      out = out.filter(e => allowed.has(e.id));
    }
    return out;
  }, [wcFilter, catFilter, indexes]);

  const matches = useMemo(() => {
    if (!computed || !indexes) return [];
    return filterEntries(indexes.idx[activeCipher][computed.values[activeCipher]] || []);
  }, [computed, indexes, activeCipher, filterEntries]);

  const ranked = useMemo(() => {
    if (!computed || !indexes) return [];
    const exact    = indexes.idx[activeCipher][computed.values[activeCipher]] || [];
    const exactSet = new Set(exact.map(e => e.id));
    return filterEntries(rankByCrossMatch(indexes, computed.values, exactSet, 6)).slice(0, 3);
  }, [computed, indexes, activeCipher, filterEntries]);

  const numTarget = useMemo(() => {
    if (debouncedNumInput.trim() === "") return null;
    const n = parseInt(debouncedNumInput, 10);
    return isNaN(n) ? null : n;
  }, [debouncedNumInput]);

  const numMatches = useMemo(() => {
    if (numTarget === null || !indexes) return [];
    return filterEntries(indexes.idx[activeCipher][numTarget] || []);
  }, [numTarget, indexes, activeCipher, filterEntries]);

  const numRanked = useMemo(() => {
    if (numTarget === null || !indexes) return [];
    const tv = {};
    for (const c of CIPHER_KEYS) tv[c] = numTarget;
    const exactSet = new Set((indexes.idx[activeCipher][numTarget] || []).map(e => e.id));
    return filterEntries(rankByCrossMatch(indexes, tv, exactSet, 6)).slice(0, 3);
  }, [numTarget, indexes, activeCipher, filterEntries]);

  const swapResults = useMemo(() => {
    if (!swapWord || !indexes) return [];
    return wordSimilar(swapWord.word, indexes, 8);
  }, [swapWord, indexes]);

  const handleChange    = useCallback(e => { setInput(e.target.value); setSwapWord(null); }, []);
  const handleNumChange = useCallback(e => setNumInput(e.target.value), []);
  const handleKey       = useCallback(e => { if (e.key === "Enter" && norm) onHistoryPush(norm); }, [norm, onHistoryPush]);
  const handleWcFilter  = useCallback(e => {
    const v = +e.currentTarget.dataset.wc;
    setWcFilter(x => x === v ? 0 : v);
  }, []);
  const handleCatFilter = useCallback(e => {
    const cat = e.currentTarget.dataset.cat;
    setCatFilter(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  }, []);
  const handleWordTap = useCallback(e => {
    const idx = +e.currentTarget.dataset.widx;
    const w   = e.currentTarget.dataset.word;
    setSwapWord(s => s && s.wordIdx === idx ? null : { wordIdx: idx, word: w });
  }, []);
  const closeSwap = useCallback(() => setSwapWord(null), []);

  const wordChips = useMemo(() => norm ? norm.split(" ") : [], [norm]);

  return (
    <Card>
      <SectionLabel>Lookup</SectionLabel>
      <Inp
        value={input}
        onChange={handleChange}
        placeholder="any word or phrase..."
        accentColor={ac.color}
        onKeyDown={handleKey}
        style={{ marginBottom: 10 }}
      />

      {computed && norm && (
        <>
          {/* Meta row */}
          <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:8 }}>
            <span style={{ fontSize:11, color:T.textDim }}>{computed.wc}w · {computed.lc}L</span>
            <CopyBtn text={norm} id="lu-norm" copy={copy} copiedId={copiedId}/>
          </div>

          {/* Cipher value badges — horizontal scroll */}
          <div style={{
            display:"flex", gap:6, marginBottom:12,
            overflowX:"auto", WebkitOverflowScrolling:"touch", scrollbarWidth:"none",
          }}>
            {CIPHER_KEYS.map(c => (
              <ValueBadge key={c} cipher={c} value={computed.values[c]} showRoot/>
            ))}
          </div>

          {/* Tappable word chips — show active cipher value, tap to see similar */}
          {wordChips.length > 1 && (
            <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:10 }}>
              {wordChips.map((w, i) => {
                const active = swapWord && swapWord.wordIdx === i;
                const wVal   = calcValues(normalize(w))[activeCipher];
                return (
                  <button key={i} data-widx={i} data-word={w} onClick={handleWordTap} style={{
                    padding:      "5px 10px",
                    borderRadius: T.radius,
                    border:       `1px solid ${active ? ac.color : T.border2}`,
                    background:   active ? `${ac.color}1a` : T.bg2,
                    color:        active ? ac.color : T.textMid,
                    fontSize:     12,
                    fontFamily:   T.mono,
                    cursor:       "pointer",
                    fontWeight:   active ? 700 : 400,
                    display:      "flex",
                    flexDirection:"column",
                    alignItems:   "center",
                    gap:          2,
                  }}>
                    <span>{w}</span>
                    <span style={{
                      fontSize:   9,
                      color:      active ? ac.color : T.textDim,
                      fontWeight: 700,
                    }}>{wVal}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Similar words panel */}
          {swapWord && (
            <div style={{
              background:   T.bg0,
              border:       `1px solid ${ac.color}55`,
              borderRadius: T.radius,
              padding:      "10px 12px",
              marginBottom: 10,
            }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                <span style={{ fontSize:11, color:ac.color, fontWeight:700 }}>
                  similar to "{swapWord.word}"
                </span>
                <button onClick={closeSwap} style={{
                  background:"transparent", border:"none", color:T.textDim,
                  cursor:"pointer", fontSize:14, padding:"0 4px",
                }}>×</button>
              </div>
              {swapResults.length === 0
                ? <EmptyState text="No similar entries found"/>
                : swapResults.map(e => (
                  <MatchRow key={e.id} entry={e} cipher={activeCipher}
                    copy={copy} copiedId={copiedId} showAllCiphers/>
                ))
              }
            </div>
          )}

          {/* Category filter pills — horizontal scroll */}
          <div style={{
            display:"flex", gap:5, marginBottom:8,
            overflowX:"auto", WebkitOverflowScrolling:"touch", scrollbarWidth:"none",
          }}>
            {CATEGORIES.map(({ label, short }) => {
              const on = catFilter.has(label);
              return (
                <button key={label} data-cat={label} onClick={handleCatFilter} style={{
                  padding:      "3px 10px",
                  borderRadius: 20,
                  border:       `1px solid ${on ? ac.color : T.border}`,
                  background:   on ? `${ac.color}1a` : "transparent",
                  color:        on ? ac.color : T.textDim,
                  fontSize:     11,
                  fontFamily:   T.mono,
                  cursor:       "pointer",
                  flexShrink:   0,
                  fontWeight:   on ? 700 : 400,
                }}>{short}</button>
              );
            })}
          </div>

          {/* Word count filter pills */}
          <div style={{ display:"flex", gap:5, marginBottom:10, flexWrap:"wrap" }}>
            {WC_FILTERS.map(n => (
              <button key={n} data-wc={n} onClick={handleWcFilter} style={{
                padding:      "3px 10px",
                borderRadius: 20,
                border:       `1px solid ${wcFilter===n ? ac.color : T.border}`,
                background:   wcFilter===n ? `${ac.color}1a` : "transparent",
                color:        wcFilter===n ? ac.color : T.textDim,
                fontSize:     11,
                fontFamily:   T.mono,
                cursor:       "pointer",
              }}>{n}w</button>
            ))}
            <button data-wc={6} onClick={handleWcFilter} style={{
              padding:      "3px 10px",
              borderRadius: 20,
              border:       `1px solid ${wcFilter===6 ? ac.color : T.border}`,
              background:   wcFilter===6 ? `${ac.color}1a` : "transparent",
              color:        wcFilter===6 ? ac.color : T.textDim,
              fontSize:     11,
              fontFamily:   T.mono,
              cursor:       "pointer",
            }}>5+w</button>
          </div>

          {/* Match count */}
          <div style={{ fontSize:11, color:ac.color, fontWeight:700, marginBottom:8 }}>
            {matches.length} match{matches.length !== 1 ? "es" : ""} · {ac.short} = {computed.values[activeCipher]}
          </div>

          {/* Results */}
          <div style={{ maxHeight:280, overflowY:"auto", display:"grid", gap:4, marginBottom:12 }}>
            {ranked.length > 0 && (
              <>
                {ranked.map(e => (
                  <MatchRow key={`ranked-${e.id}`} entry={e} cipher={activeCipher}
                    copy={copy} copiedId={copiedId} showAllCiphers/>
                ))}
                {matches.length > 0 && <div style={{ borderTop:`1px solid ${T.border}`, margin:"2px 0" }}/>}
              </>
            )}
            {matches.length === 0 && ranked.length === 0
              ? <EmptyState text="No database matches"/>
              : matches.map(e => (
                <MatchRow key={e.id} entry={e} cipher={activeCipher}
                  copy={copy} copiedId={copiedId} showAllCiphers={false}/>
              ))
            }
          </div>
        </>
      )}

      {/* Numeric search */}
      <div style={{ borderTop:`1px solid ${T.border}`, paddingTop:12 }}>
        <FieldLabel>{ac.short} value search</FieldLabel>
        <Inp
          type="number"
          value={numInput}
          onChange={handleNumChange}
          placeholder={`search by ${ac.short} value...`}
          accentColor={ac.color}
          style={{ marginBottom: numTarget !== null ? 10 : 0 }}
        />
        {numTarget !== null && (
          <>
            <div style={{ fontSize:11, color:ac.color, fontWeight:700, marginBottom:8 }}>
              {numMatches.length} match{numMatches.length !== 1 ? "es" : ""} · {ac.short} = {numTarget}
            </div>
            <div style={{ maxHeight:260, overflowY:"auto", display:"grid", gap:4 }}>
              {numRanked.length > 0 && (
                <>
                  {numRanked.map(e => (
                    <MatchRow key={`numranked-${e.id}`} entry={e} cipher={activeCipher}
                      copy={copy} copiedId={copiedId} showAllCiphers/>
                  ))}
                  {numMatches.length > 0 && <div style={{ borderTop:`1px solid ${T.border}`, margin:"2px 0" }}/>}
                </>
              )}
              {numMatches.length === 0 && numRanked.length === 0
                ? <EmptyState text="No matches for this value"/>
                : numMatches.map(e => (
                  <MatchRow key={e.id} entry={e} cipher={activeCipher}
                    copy={copy} copiedId={copiedId} showAllCiphers={false}/>
                ))
              }
            </div>
          </>
        )}
      </div>
    </Card>
  );
}

const MatchRow = memo(({ entry, cipher, copy, copiedId, showAllCiphers }) => {
  const { color } = CIPHERS[cipher];
  return (
    <div style={{
      display:        "flex",
      justifyContent: "space-between",
      alignItems:     "center",
      padding:        "10px 12px",
      borderRadius:   T.radius,
      background:     T.bg2,
      border:         `1px solid ${T.border}`,
      gap:            8,
    }}>
      <div style={{ minWidth:0, flex:1 }}>
        <div style={{ color:T.text, fontSize:14, lineHeight:1.4 }}>{entry.raw}</div>
        {showAllCiphers && (
          <div style={{
            display:"flex", gap:6, marginTop:5,
            overflowX:"auto", WebkitOverflowScrolling:"touch",
            scrollbarWidth:"none",
          }}>
            {CIPHER_KEYS.map(c => (
              <span key={c} style={{
                fontSize:10, fontFamily:"'Courier New',monospace",
                color:CIPHERS[c].color, flexShrink:0, opacity:0.85,
              }}>{CIPHERS[c].short} {entry.values[c]}</span>
            ))}
          </div>
        )}
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:4, flexShrink:0 }}>
        <span style={{ color, fontFamily:"'Courier New',monospace", fontSize:13, fontWeight:700 }}>
          {entry.values[cipher]}
        </span>
        <CopyBtn text={entry.raw} id={`mr-${entry.id}`} copy={copy} copiedId={copiedId}/>
      </div>
    </div>
  );
});

// ================================================================
// § CALCULATOR PANEL
// ================================================================
let _calcTermId = 0;
function newTerm(op = "+") { return { id: _calcTermId++, text:"", op }; }

// Hoisted static styles — not recreated on every render
const TERM_ROW_STYLE = { display:"flex", gap:4, marginBottom:6, alignItems:"center" };
const TERM_NUM_STYLE = {
  width:22, fontSize:10, color:"#444444", textAlign:"center",
  flexShrink:0, fontFamily:"'Courier New',monospace", fontWeight:700,
};

function CalcPanel({ indexes, activeCipher, copy, copiedId }) {
  const [terms,        setTerms]       = useState(() => [newTerm("+"), newTerm("+")]);
  const [showMatches,  setShowMatches] = useState(false); // Issue #7: separate from view
  const [view,         setView]        = useState("terms");
  const [showAvg,      setShowAvg]     = useState(false);
  const [showNearest,  setShowNearest] = useState(false);
  const [expandCipher, setExpandCipher] = useState(activeCipher);

  useEffect(() => { setExpandCipher(activeCipher); }, [activeCipher]);
  const ac = CIPHERS[activeCipher];

  const result = useMemo(() => calcExpression(terms), [terms]);

  // Issue #6: activeValues depends only on result+showAvg — not chained through allMatches
  const activeValues = useMemo(() => {
    if (!result) return null;
    return showAvg ? result.avg : result.totals;
  }, [result, showAvg]);

  // Issue #6: allMatches depends only on activeValues — removed result dep
  const allMatches = useMemo(() => {
    if (!activeValues) return {};
    const out = {};
    for (const c of CIPHER_KEYS) {
      const v = activeValues[c];
      out[c] = v >= 0 ? (indexes.idx[c][v] || []) : [];
    }
    return out;
  }, [activeValues, indexes]);

  const nearest = useMemo(() => {
    if (!activeValues || !showNearest) return null;
    const v     = activeValues[expandCipher];
    const exact = indexes.idx[expandCipher][v] || [];
    if (exact.length > 0) return null;
    return nearestInIndex(indexes.idx, indexes.sortedVals, expandCipher, v, 6);
  }, [activeValues, showNearest, indexes, expandCipher]);

  const parsedTerms = result ? result.parsed : [];

  // Resonance: find which pairs of terms share a value on any cipher
  const resonance = useMemo(() => {
    if (!parsedTerms || parsedTerms.length < 2) return { pairs: [], glowCiphers: new Set() };
    const pairs = [];
    const glowCiphers = new Set(); // cipher keys that have at least one match
    for (let i = 0; i < parsedTerms.length; i++) {
      for (let j = i + 1; j < parsedTerms.length; j++) {
        const shared = [];
        for (const c of CIPHER_KEYS) {
          if (parsedTerms[i].values[c] === parsedTerms[j].values[c]) {
            shared.push(c);
            glowCiphers.add(c);
          }
        }
        if (shared.length) pairs.push({ i, j, shared });
      }
    }
    return { pairs, glowCiphers };
  }, [parsedTerms]);

  // Issue #7: only runs when showMatches is true — not gated by view string
  const chartMatches = useMemo(() => {
    if (!activeValues || !showMatches) return [];
    const seen   = new Set();
    const scored = [];
    for (const c of CIPHER_KEYS) {
      const bucket = indexes.idx[c][activeValues[c]] || [];
      for (const e of bucket) {
        if (seen.has(e.id)) continue;
        seen.add(e.id);
        let hits = 0;
        const hitCiphers = [];
        for (const cc of CIPHER_KEYS) {
          if (e.values[cc] === activeValues[cc]) { hits++; hitCiphers.push(cc); }
        }
        scored.push({ e, hits, hitCiphers });
      }
    }
    scored.sort((a, b) => b.hits - a.hits);
    return scored;
  }, [activeValues, indexes, showMatches]);

  // Issue #8: stable callbacks using functional updater — no inline arrows on term rows
  const handleTermText = useCallback(e => {
    const id  = e.currentTarget.dataset.id;
    const val = e.currentTarget.value;
    setTerms(ts => ts.map(t => t.id === +id ? { ...t, text: val } : t));
  }, []);
  const handleTermOp = useCallback(e => {
    const id  = e.currentTarget.dataset.id;
    const val = e.currentTarget.value;
    setTerms(ts => ts.map(t => t.id === +id ? { ...t, op: val } : t));
  }, []);
  const handleRemoveTerm = useCallback(e => {
    const id = +e.currentTarget.dataset.id;
    setTerms(ts => ts.length > 1 ? ts.filter(t => t.id !== id) : ts);
  }, []);
  const addTerm  = useCallback(() => setTerms(ts => [...ts, newTerm("+")]), []);
  const clearAll = useCallback(() => {
    setTerms([newTerm("+"), newTerm("+")]);
    setView("terms");
    setShowMatches(false);
  }, []);
  const handleViewTerms   = useCallback(() => setView("terms"),   []);
  const handleViewMatches = useCallback(() => {
    setView("chart");
    setShowMatches(true);
  }, []);

  return (
    <Card>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:8 }}>
        <SectionLabel>Calculator</SectionLabel>
        <div style={{ display:"flex", gap:4 }}>
          <Btn active={view==="terms"} color={ac.color}
            onClick={handleViewTerms}
            style={{ fontSize:10, padding:"3px 8px" }}>
            terms
          </Btn>
          <Btn active={view==="chart"} color={ac.color}
            onClick={handleViewMatches}
            style={{ fontSize:10, padding:"3px 8px" }}>
            matches
          </Btn>
          <Btn onClick={addTerm}  style={{ fontSize:10, padding:"3px 7px" }}>+</Btn>
          <Btn onClick={clearAll} style={{ fontSize:10, padding:"3px 7px" }}>clear</Btn>
        </div>
      </div>

      {/* ── TERMS VIEW ── */}
      {view === "terms" && (
        <>
          {terms.map((t, i) => (
            <div key={t.id} style={TERM_ROW_STYLE}>
              <div style={TERM_NUM_STYLE}>{i + 1}</div>
              {i > 0 && (
                <select
                  data-id={t.id}
                  value={t.op}
                  onChange={handleTermOp}
                  style={{ ...baseInputStyle, width:36, padding:"6px 3px", flexShrink:0, textAlign:"center" }}>
                  <option value="+">+</option>
                  <option value="-">−</option>
                </select>
              )}
              <input
                data-id={t.id}
                value={t.text}
                onChange={handleTermText}
                placeholder={`Term ${i + 1}`}
                style={{ ...baseInputStyle, flex:1, borderColor: t.text ? `${ac.color}55` : T.border }}
              />
              <Btn
                data-id={t.id}
                onClick={handleRemoveTerm}
                style={{ padding:"4px 6px", color:"#ef4444", borderColor:"transparent", flexShrink:0 }}>
                ×
              </Btn>
            </div>
          ))}

          {result && (
            <>
              <div style={{
                background:T.bg0, border:`1px solid ${ac.color}44`,
                borderRadius:T.radius, padding:"8px 10px", marginTop:8, marginBottom:8,
              }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ fontSize:10, color:T.textDim }}>
                      {showAvg ? `avg · ÷${result.totalWC}w` : `totals · ${result.totalWC}w`}
                    </span>
                    <Btn active={showAvg} color={ac.color}
                      onClick={() => setShowAvg(x => !x)}
                      style={{ fontSize:9, padding:"2px 7px" }}>
                      avg
                    </Btn>
                  </div>
                  <CopyBtn
                    text={CIPHER_KEYS.map(c => `${CIPHERS[c].short}:${activeValues[c]}`).join(" ")}
                    id="calc-totals" copy={copy} copiedId={copiedId}/>
                </div>
                {/* ValueBadges — glow white on ciphers with inter-term resonance */}
                <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                  {CIPHER_KEYS.map(c => {
                    const glows = resonance.glowCiphers.has(c);
                    return (
                      <span key={c} style={{
                        display:    "inline-flex", alignItems:"center", gap:4,
                        padding:    "4px 10px", borderRadius:6,
                        border:     `1px solid ${glows ? "rgba(255,255,255,0.5)" : CIPHERS[c].color+"33"}`,
                        fontSize:   12, fontFamily:T.mono, fontWeight:700,
                        color:      glows ? "#ffffff" : CIPHERS[c].color,
                        background: glows ? "rgba(255,255,255,0.08)" : "transparent",
                        boxShadow:  glows ? "0 0 8px rgba(255,255,255,0.2)" : "none",
                        flexShrink: 0,
                      }}>
                        <span style={{ opacity:0.55, fontWeight:400, fontSize:10 }}>{CIPHERS[c].short}</span>
                        {activeValues[c]}
                        <span style={{ opacity:0.4, fontSize:9 }}>/{digitalRoot(activeValues[c])}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Resonance summary line */}
              {resonance.pairs.length > 0 && (
                <div style={{
                  background:   T.bg0,
                  border:       "1px solid rgba(255,255,255,0.12)",
                  borderRadius: T.radius,
                  padding:      "8px 10px",
                  marginBottom: 8,
                }}>
                  <div style={{ fontSize:10, color:T.textDim, marginBottom:5, letterSpacing:"0.08em", textTransform:"uppercase" }}>
                    Resonance
                  </div>
                  {resonance.pairs.map(({ i, j, shared }) => (
                    <div key={`${i}-${j}`} style={{ fontSize:11, color:T.textMid, marginBottom:3, display:"flex", alignItems:"center", gap:6, flexWrap:"wrap" }}>
                      <span style={{ color:T.text, fontWeight:700 }}>{i+1}</span>
                      <span style={{ color:T.textDim }}>↔</span>
                      <span style={{ color:T.text, fontWeight:700 }}>{j+1}</span>
                      <span style={{ color:T.textDim }}>·</span>
                      {shared.map(c => (
                        <span key={c} style={{
                          fontSize:10, fontFamily:T.mono, fontWeight:700,
                          color:"#ffffff", background:`${CIPHERS[c].color}30`,
                          border:`1px solid ${CIPHERS[c].color}`,
                          borderRadius:4, padding:"1px 6px",
                        }}>{CIPHERS[c].short} {parsedTerms[i].values[c]}</span>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display:"flex", gap:4, marginBottom:6, flexWrap:"wrap" }}>
                {CIPHER_KEYS.map(c => {
                  const hits = allMatches[c]?.length || 0;
                  const { color, short } = CIPHERS[c];
                  return (
                    <Btn key={c} active={expandCipher===c} color={color}
                      onClick={() => setExpandCipher(c)}>
                      {short} <span style={{ opacity:0.7 }}>({hits})</span>
                    </Btn>
                  );
                })}
                <Btn active={showNearest} color={ac.color}
                  onClick={() => setShowNearest(x => !x)}
                  style={{ marginLeft:"auto" }}>
                  nearest
                </Btn>
              </div>

              <div style={{ maxHeight:200, overflowY:"auto", display:"grid", gap:3 }}>
                {(allMatches[expandCipher]||[]).length === 0 && !nearest
                  ? <EmptyState text={`No matches · ${CIPHERS[expandCipher].short} = ${activeValues[expandCipher]}`}/>
                  : (allMatches[expandCipher]||[]).map(e => (
                    <MatchRow key={e.id} entry={e} cipher={expandCipher}
                      copy={copy} copiedId={copiedId} showAllCiphers/>
                  ))
                }
                {nearest && (
                  <div style={{ marginTop:6 }}>
                    <div style={{ fontSize:9, color:T.textDim, marginBottom:4 }}>NEAREST VALUES</div>
                    {nearest.map(n => (
                      <div key={n.value} style={{ marginBottom:6 }}>
                        <div style={{ fontSize:10, color:CIPHERS[expandCipher].color, fontFamily:"'Courier New',monospace" }}>
                          {n.value} <span style={{ color:T.textDim }}>({n.delta>0?"+":""}{n.delta})</span>
                        </div>
                        <div style={{ paddingLeft:8 }}>
                          {n.entries.slice(0,3).map(e => (
                            <div key={e.id} style={{ fontSize:10, color:T.textMid, marginTop:1 }}>{e.raw}</div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}

      {/* ── MATCHES VIEW ── */}
      {view === "chart" && (
        <>
          {parsedTerms.length === 0
            ? <EmptyState text="Enter terms to see matches"/>
            : chartMatches.length === 0
            ? <EmptyState text="No database matches found"/>
            : (
              <>
                <div style={{ fontSize:10, color:T.textDim, marginBottom:8 }}>
                  {chartMatches.length} match{chartMatches.length !== 1 ? "es" : ""} · sorted by cipher overlap
                </div>
                <div style={{ maxHeight:440, overflowY:"auto", display:"grid", gap:4 }}>
                  {chartMatches.map(({ e, hits, hitCiphers }) => (
                    <div key={e.id} style={{
                      padding:      "6px 8px",
                      borderRadius: 6,
                      background:   hits > 1 ? "rgba(255,255,255,0.06)" : T.bg0,
                      border:       `1px solid ${hits > 1 ? "rgba(255,255,255,0.2)" : T.border}`,
                      boxShadow:    hits > 1 ? "0 0 8px rgba(255,255,255,0.06)" : "none",
                    }}>
                      <div style={{
                        color:       hits > 1 ? "#ffffff" : T.text,
                        fontSize:    12,
                        lineHeight:  1.3,
                        marginBottom: 4,
                      }}>{e.raw}</div>
                      <div style={{ display:"flex", flexWrap:"wrap", gap:3 }}>
                        {hitCiphers.map(c => (
                          <span key={c} style={{
                            fontSize:    9,
                            fontFamily:  "'Courier New',monospace",
                            fontWeight:  700,
                            color:       hits > 1 ? "#ffffff" : CIPHERS[c].color,
                            background:  hits > 1 ? `${CIPHERS[c].color}30` : `${CIPHERS[c].color}15`,
                            border:      `1px solid ${hits > 1 ? CIPHERS[c].color : CIPHERS[c].color+"44"}`,
                            borderRadius: 4,
                            padding:     "1px 5px",
                          }}>
                            {CIPHERS[c].short} {e.values[c]}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )
          }
        </>
      )}
    </Card>
  );
}

// ================================================================
// § HISTORY PANEL
// ================================================================
function HistoryPanel({ history, dispatch, onSelect, copy, copiedId }) {
  if (!history.length) return null;
  const handleClear  = useCallback(() => dispatch({ type:"clear" }), [dispatch]);
  const handleRemove = useCallback(e => {
    e.stopPropagation();
    dispatch({ type:"remove", ts: +e.currentTarget.dataset.ts });
  }, [dispatch]);
  const handleSelect = useCallback(e => {
    onSelect(e.currentTarget.dataset.text);
  }, [onSelect]);
  return (
    <Card>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
        <SectionLabel>History</SectionLabel>
        <Btn onClick={handleClear} style={{ fontSize:10, padding:"4px 10px" }}>clear</Btn>
      </div>
      <div style={{ maxHeight:160, overflowY:"auto", display:"grid", gap:4 }}>
        {history.map(h => (
          <div key={h.ts} data-text={h.text} onClick={handleSelect} style={{
            display:"flex", justifyContent:"space-between", alignItems:"center",
            padding:"10px 12px", borderRadius:T.radius, background:T.bg2,
            border:`1px solid ${T.border}`, cursor:"pointer",
          }}>
            <span style={{ fontSize:14, color:T.textMid }}>{h.text}</span>
            <div style={{ display:"flex", gap:2 }}>
              <CopyBtn text={h.text} id={`hist-${h.ts}`} copy={copy} copiedId={copiedId}/>
              <Btn data-ts={h.ts} onClick={handleRemove}
                style={{ fontSize:10, padding:"2px 8px", color:"#ef4444", border:"none" }}>×</Btn>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ================================================================
// § APP ROOT
// ================================================================
export default function App() {
  const [activeCipher, setActiveCipher] = useState("simple");
  const [history,      histDispatch]    = useReducer(historyReducer, []);
  const { copy, copiedId } = useCopy();

  const { indexes, count, loading } = useIndexes(SEED_PHRASES);

  const handleHistoryPush   = useCallback(text => histDispatch({ type:"push", text }), []);
  const handleHistorySelect = useCallback(() => {}, []);
  const setCipher           = useCallback(v => setActiveCipher(v), []);

  return (
    <div style={{ minHeight:"100vh", background:T.bg0, color:T.text, fontFamily:T.mono, fontSize:15 }}>

      {/* ── HEADER ── */}
      <div style={{
        borderBottom: `1px solid ${T.border}`,
        padding:      "10px 16px",
        display:      "flex",
        alignItems:   "center",
        gap:          12,
        position:     "sticky",
        top:          0,
        background:   T.bg0,
        zIndex:       100,
      }}>
        <RainbowEye size={40}/>
        <RainbowText size={24}/>
        <div style={{
          borderLeft:    `1px solid ${T.border}`,
          paddingLeft:   12,
          display:       "flex",
          flexDirection: "column",
          gap:           1,
        }}>
          {loading
            ? <div style={{ fontSize:11, color:T.textDim }}>loading…</div>
            : <>
                <div style={{
                  fontFamily: T.mono, fontWeight:700, fontSize:15,
                  background: "linear-gradient(90deg,#38bdf8,#c084fc,#fb923c,#4ade80)",
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                }}>{count}</div>
                <div style={{ fontSize:9, color:T.textDim }}>phrases</div>
              </>
          }
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <CipherSelector active={activeCipher} onChange={setCipher}/>
        </div>
      </div>

      {/* ── LOADING STATE ── */}
      {loading && (
        <div style={{
          display:"flex", flexDirection:"column", alignItems:"center",
          justifyContent:"center", minHeight:"60vh", gap:16,
        }}>
          <RainbowEye size={60}/>
          <div style={{ fontSize:12, color:T.textDim, letterSpacing:"0.12em", textTransform:"uppercase" }}>
            building index…
          </div>
        </div>
      )}

      {/* ── UNIFIED PANEL ── */}
      {!loading && indexes && (
        <div style={{ padding:"16px 14px", maxWidth:560, margin:"0 auto" }}>
          <LookupPanel
            indexes={indexes} activeCipher={activeCipher}
            copy={copy} copiedId={copiedId}
            onHistoryPush={handleHistoryPush}
          />
          <HistoryPanel
            history={history} dispatch={histDispatch}
            onSelect={handleHistorySelect}
            copy={copy} copiedId={copiedId}
          />
          <div style={{ display:"flex", alignItems:"center", gap:10, margin:"4px 0 12px" }}>
            <div style={{ flex:1, height:1, background:T.border }}/>
            <span style={{ fontSize:10, color:T.textDim, letterSpacing:"0.1em", textTransform:"uppercase" }}>
              calculator
            </span>
            <div style={{ flex:1, height:1, background:T.border }}/>
          </div>
          <CalcPanel
            indexes={indexes} activeCipher={activeCipher}
            copy={copy} copiedId={copiedId}
          />

          <div style={{ display:"flex", alignItems:"center", gap:10, margin:"16px 0 12px" }}>
            <div style={{ flex:1, height:1, background:T.border }}/>
            <span style={{ fontSize:10, color:T.textDim, letterSpacing:"0.1em", textTransform:"uppercase" }}>
              name
            </span>
            <div style={{ flex:1, height:1, background:T.border }}/>
          </div>
          <NamePanel
            indexes={indexes}
            copy={copy} copiedId={copiedId}
          />

          <div style={{ display:"flex", alignItems:"center", gap:10, margin:"16px 0 12px" }}>
            <div style={{ flex:1, height:1, background:T.border }}/>
            <span style={{ fontSize:10, color:T.textDim, letterSpacing:"0.1em", textTransform:"uppercase" }}>
              glyph
            </span>
            <div style={{ flex:1, height:1, background:T.border }}/>
          </div>
          <GlyphPanel
            copy={copy} copiedId={copiedId}
          />

        </div>
      )}
    </div>
  );
}
