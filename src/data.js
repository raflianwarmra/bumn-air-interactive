/* BUMN Air interactive — content & diagram data.
   Sources: Model.md (Jun 2026), Concept Note Series 1–4 (Jun 2026),
   "Model 3 Kanal BUMN Air" diagram (Jul 2026), slide "Pakai Model BUMN Air" (Jul 2026).
   Every user-facing string is {id, en}. Arrays of 4 follow model order:
   0 Holding · 1 Bulk · 2 Concession & O&M · 3 End-to-End. */
window.BUMN_DATA = (() => {
  const T = (id, en) => ({ id, en });

  /* ---------- UI strings ---------- */
  const ui = {
    brand: T('BUMN Air', 'BUMN Air'),
    brandSub: T('Model kelembagaan, interaktif', 'Institutional models, interactive'),
    navProblem: T('Masalah', 'Problem'),
    navModels: T('Empat model', 'Four models'),
    navRec: T('Rekomendasi', 'Recommendation'),
    tour: T('Tur', 'Tour'),
    skip: T('Lompat ke diagram', 'Skip to diagram'),

    heroKicker: T('Kajian kelembagaan sektor air minum', 'Drinking water institutional study'),
    heroTitleA: T('Satu negara,', 'One country,'),
    heroTitleB: T('391 operator air minum.', '391 drinking water operators.'),
    heroLede: T(
      'Hampir setiap kabupaten dan kota punya PDAM sendiri, dengan tarif, neraca, dan standar layanannya sendiri. Terlalu kecil untuk dibiayai, terlalu tersebar untuk distandarkan.',
      'Almost every district and city runs its own water utility (PDAM), with its own tariff, balance sheet and service standard. Too small to finance, too scattered to standardise.'
    ),
    mapCaption: T('Setiap titik: satu PDAM. Ilustrasi sebaran, bukan peta lokasi.', 'Each dot: one PDAM. Illustrative spread, not a location map.'),
    fact1: T('kepala daerah menetapkan tarif masing-masing; sebagian besar di bawah pemulihan biaya penuh.', 'local government heads each set their own tariff; most sit below full cost recovery.'),
    fact1n: T('394', '394'),
    fact2: T('dari portofolio komitmen PT SMI (±Rp 8 T) yang mengalir ke air minum daerah. PDAM berulang kali gagal uji kelayakan kredit.', 'of PT SMI’s commitment portfolio (≈Rp 8 T) goes to sub-national water. PDAMs repeatedly fail creditworthiness tests.'),
    fact2n: T('<5%', '<5%'),
    fact3: T('perkiraan nilai aset sektor bila dikonsolidasi secara nasional: empat kali Jasa Marga, dua kali Telkom.', 'estimated sector asset value if consolidated nationally: four times Jasa Marga, twice Telkom.'),
    fact3n: T('Rp 200 T → ±500 T', 'Rp 200 T → ≈500 T'),
    heroQuestion: T(
      'Pertanyaannya bukan perlu BUMN Air atau tidak, tetapi seberapa dalam ia masuk ke rantai layanan.',
      'The question is not whether to have a national water company, but how deep it should reach into the service chain.'
    ),
    heroCta: T('Jelajahi empat model', 'Explore the four models'),

    modelsTitle: T('Seberapa dalam BUMN Air masuk?', 'How deep does BUMN Air go?'),
    modelsLede: T(
      'Geser untuk berpindah model. Tata kelola di atas tidak berubah. Yang berubah: siapa mengoperasikan, siapa memiliki aset, dan siapa menetapkan tarif.',
      'Slide to switch models. The governance layer on top never changes. What changes: who operates, who owns the assets, and who sets the tariff.'
    ),
    specLeft: T('Ringan secara politik', 'Politically light'),
    specLeftSub: T('BUMN memegang saham', 'BUMN holds shares'),
    specRight: T('Paling tuntas', 'Most complete'),
    specRightSub: T('BUMN mengoperasikan semuanya', 'BUMN runs everything'),
    sliderLabel: T('Pilih model BUMN Air', 'Choose a BUMN Air model'),
    dragHint: T('Geser diagram', 'Scroll the diagram'),

    flowWater: T('Air', 'Water'),
    flowMoney: T('Uang', 'Money'),
    flowAuth: T('Kewenangan', 'Authority'),
    flowsLabel: T('Tampilkan aliran', 'Show flows'),
    legendGov: T('Pemerintah', 'Government'),
    legendBumn: T('BUMN Air', 'BUMN Air'),
    legendPdam: T('PDAM / BUMD', 'PDAM / BUMD'),
    legendCust: T('Pelanggan', 'Customers'),
    legendLost: T('Peran dilebur', 'Role absorbed'),
    compare: T('Bandingkan', 'Compare'),
    compareOn: T('vs', 'vs'),
    compareOff: T('Selesai', 'Done'),
    compareHint: T('Kunci model ini, lalu geser ke model lain.', 'Pin this model, then slide to another.'),

    scoreRole: T('Peran BUMN Air', 'Role of BUMN Air'),
    scoreOperator: T('Operator harian', 'Day-to-day operator'),
    scoreAssets: T('Pemilik aset', 'Asset owner'),
    scoreTariff: T('Penetap tarif', 'Tariff setter'),
    scorePdam: T('Posisi PDAM', 'Position of PDAM'),
    scoreLink: T('Ikatan dengan daerah', 'Link with the region'),
    scorePre: T('Prasyarat', 'Precondition'),
    scorePrec: T('Preseden', 'Precedents'),
    meterLegal: T('Beban legislasi', 'Legislative burden'),
    meterTariff: T('Fragmentasi tarif teratasi', 'Tariff fragmentation solved'),
    meterControl: T('Kendali operasi oleh BUMN', 'Operational control by BUMN'),
    meterLow: T('rendah', 'low'),
    meterHigh: T('tinggi', 'high'),
    pros: T('Kekuatan', 'Strengths'),
    cons: T('Tantangan', 'Trade-offs'),
    lensTitle: T('Dari sudut pandang', 'Through the eyes of'),
    lensPemda: T('Pemda', 'Local gov.'),
    lensInvestor: T('Danantara & investor', 'Danantara & investors'),
    lensCustomer: T('Pelanggan', 'Customers'),

    recKicker: T('Rekomendasi', 'Recommendation'),
    recTitle: T('Satu BUMN, tiga kanal.', 'One company, three channels.'),
    recLede: T(
      'BUMN Air Nasional dibentuk sebagai holding investasi dan operator strategis untuk air baku, air minum, dan air limbah. Cara ia menjangkau pelanggan mengikuti kondisi wilayah.',
      'BUMN Air Nasional is set up as an investment holding and strategic operator for raw water, drinking water and wastewater. How it reaches customers depends on the region.'
    ),
    recAsk: T('Bagaimana kondisi wilayahnya?', 'What is the region like?'),
    recStructure: T('Struktur', 'Structure'),
    recPemda: T('Peran Pemda', 'Role of local government'),
    recContract: T('Ikatan kontrak', 'Contract'),
    recVariant: T('Varian: ritel tetap di BUMD', 'Variant: retail stays with BUMD'),
    recUpstream: T('Hulu', 'Upstream'),
    recDownstream: T('Hilir / ritel', 'Downstream / retail'),
    recHoldingBox: T('BUMN AIR NASIONAL', 'BUMN AIR NASIONAL'),
    recHoldingSub: T('holding investasi & operator strategis', 'investment holding & strategic operator'),
    recCustomers: T('Pelanggan / Masyarakat', 'Customers / Public'),
    recNote: T(
      'Model Holding menjadi payung. Bulk dan End-to-End menjadi kanal operasi. Joint venture menjadi jembatan dengan BUMD yang sehat.',
      'The Holding model is the umbrella. Bulk and End-to-End are operating channels. Joint ventures bridge to healthy BUMDs.'
    ),

    footer: T(
      'Draf untuk diskusi. Disusun oleh Muh Rafli Anwar, Kementerian PPN/Bappenas, dari Concept Note Series BUMN Air (Juni 2026) dan model tiga kanal (Juli 2026). Bukan posisi resmi pemerintah.',
      'Draft for discussion. Prepared by Muh Rafli Anwar, Ministry of National Development Planning/Bappenas, from the BUMN Air Concept Note Series (June 2026) and the three-channel model (July 2026). Not an official government position.'
    ),
    keys: T('Pintasan: ← → ganti model · 1–4 pilih model · T tur · L bahasa', 'Shortcuts: ← → switch model · 1–4 pick model · T tour · L language'),

    tourOf: T('dari', 'of'),
    tourPrev: T('Sebelumnya', 'Previous'),
    tourNext: T('Lanjut', 'Next'),
    tourDone: T('Selesai', 'Finish'),
    tourClose: T('Tutup tur', 'Close tour'),
  };

  /* ---------- Four models ---------- */
  const models = [
    {
      key: 'holding',
      short: T('Holding', 'Holding'),
      name: T('Model Holding', 'Holding Model'),
      tagline: T('Kepemilikan tanpa kendali operasional', 'Ownership without operational control'),
      summary: T(
        'BUMN Air masuk sebagai pemegang saham dan penyedia modal di PDAM. Operasi harian, aset, dan tarif tetap di daerah.',
        'BUMN Air enters as shareholder and capital provider to PDAMs. Daily operations, assets and tariffs stay with the region.'
      ),
      score: {
        role: T('Pemegang saham & penyedia modal', 'Shareholder & capital provider'),
        operator: T('PDAM', 'PDAM'),
        assets: T('Daerah / PDAM', 'Region / PDAM'),
        tariff: T('Pemda (tarif lokal)', 'Local government (local tariff)'),
        pdam: T('Tetap operator penuh', 'Remains full operator'),
        link: T('Penyertaan modal ≤49%', 'Equity stake ≤49%'),
        pre: T('Konversi Perumda → Perseroda', 'Convert Perumda → Perseroda'),
        prec: T('Águas de Portugal (sebagian), Astra, Danantara Investment Mgmt.', 'Águas de Portugal (partial), Astra, Danantara Investment Mgmt.'),
      },
      meters: { legal: 1, tariff: 0, control: 0.5 },
      pros: T('Paling ringan secara politik; otonomi daerah tidak terganggu. Menjawab kendala utama: tidak ada peminjam yang layak kredit.', 'Lightest politically; regional autonomy untouched. Tackles the binding constraint: no creditworthy borrowers.'),
      cons: T('Fragmentasi tarif tidak terjawab; dampak pada layanan bergantung pada tiap PDAM.', 'Tariff fragmentation unresolved; service impact depends on each PDAM.'),
      lens: {
        pemda: T('Tetap pemilik mayoritas (≥51%) dan tetap menetapkan tarif. Mendapat suntikan modal dan standar kinerja, dengan wakil BUMN di dewan.', 'Stays majority owner (≥51%) and keeps setting tariffs. Gains capital and performance standards, with BUMN seats on the board.'),
        investor: T('Satu pintu ekuitas ke banyak PDAM. Tetapi tiap PDAM tetap membawa neraca dan risiko tarifnya sendiri, jadi kelayakan kredit naik bertahap.', 'One equity gateway into many PDAMs. But each PDAM keeps its own balance sheet and tariff risk, so creditworthiness improves gradually.'),
        customer: T('Layanan tetap dari PDAM yang sama, dengan tarif lokal. Perbaikan datang lewat investasi dan standar kinerja.', 'Service still comes from the same PDAM at the local tariff. Improvements come through investment and performance standards.'),
      },
    },
    {
      key: 'bulk',
      short: T('Bulk (Hulu)', 'Bulk (Upstream)'),
      name: T('Model Bulk Services', 'Bulk Services Model'),
      tagline: T('Hulu dan hilir dipisah', 'Upstream and retail separated'),
      summary: T(
        'BUMN Air mengelola hulu: air baku, produksi air curah, dan pengolahan air limbah. Air curah dijual ke PDAM lewat kontrak WPA; PDAM tetap menyalurkan ke pelanggan.',
        'BUMN Air runs the upstream: raw water, bulk production and wastewater treatment. Bulk water is sold to PDAMs under Water Purchase Agreements (WPA); PDAMs still distribute to customers.'
      ),
      score: {
        role: T('Operator hulu: air curah & air limbah', 'Upstream operator: bulk water & wastewater'),
        operator: T('BUMN (hulu) · PDAM (hilir)', 'BUMN (upstream) · PDAM (retail)'),
        assets: T('Hulu: BUMN · Distribusi: daerah', 'Upstream: BUMN · Distribution: region'),
        tariff: T('Harga curah: Pusat (dapat dikurangi PSO) · Ritel: Pemda', 'Bulk price: central (PSO-reducible) · Retail: local gov.'),
        pdam: T('Distributor ritel; tidak memproduksi air curah', 'Retail distributor; no own bulk production'),
        link: T('Kontrak WPA + tipping fee air limbah', 'WPA contract + wastewater tipping fee'),
        pre: T('Perluas mandat PJT I/II; PP kerja sama BUMN–BUMD', 'Extend PJT I/II mandate; regulation on BUMN–BUMD cooperation'),
        prec: T('Águas de Portugal, Seqwater Queensland, K-Water', 'Águas de Portugal, Seqwater Queensland, K-Water'),
      },
      meters: { legal: 2, tariff: 1.5, control: 1.5 },
      pros: T('Kualitas dan skala hulu terkendali nasional; PDAM tetap milik daerah; BUMN dapat menerbitkan obligasi atas aset hulu. Paling siap dijalankan lewat PJT I/II.', 'Upstream quality and scale controlled nationally; PDAMs stay locally owned; BUMN can issue bonds on upstream assets. Most implementation-ready via PJT I/II.'),
      cons: T('Dua lapis harga; aset hulu dialihkan ke BUMN; kontrak WPA dengan banyak PDAM.', 'Two price layers; upstream assets transferred to BUMN; WPAs with many PDAMs.'),
      lens: {
        pemda: T('Tetap memiliki PDAM dan menetapkan tarif ritel, tetapi melepas aset hulu. Tidak lagi menanggung investasi produksi; membayar air curah sesuai kontrak.', 'Keeps its PDAM and sets the retail tariff, but hands over upstream assets. No longer carries production investment; pays for bulk water by contract.'),
        investor: T('Arus kas dari kontrak WPA jangka panjang dengan harga dari Pusat: bentuk yang paling mudah dipricing. Aset hulu bisa menjadi dasar obligasi.', 'Cash flow from long-term WPAs priced by the centre: the easiest form to price. Upstream assets can back bonds.'),
        customer: T('Tetap dilayani dan ditagih PDAM. Pasokan air curah lebih andal; tarif ritel tetap keputusan daerah.', 'Still served and billed by the PDAM. Bulk supply becomes more reliable; the retail tariff stays a local decision.'),
      },
    },
    {
      key: 'concession',
      short: T('Konsesi & O&M', 'Concession & O&M'),
      name: T('Model Konsesi & O&M', 'Concession & O&M Model'),
      tagline: T('Operator nasional di atas aset daerah', 'A national operator on locally owned assets'),
      summary: T(
        'Pemda memberi konsesi 25–30 tahun. BUMN Air mengoperasikan seluruh sistem, menagih pelanggan, membayar fee konsesi, dan membiayai ekspansi lewat KPBU/BOT. Kepemilikan aset tidak berpindah.',
        'The region grants a 25–30 year concession. BUMN Air runs the whole system, bills customers, pays a concession fee and finances expansion through PPP/BOT. Asset ownership does not move.'
      ),
      score: {
        role: T('Konsesioner: operator penuh, rehabilitasi, ekspansi', 'Concessionaire: full operator, rehabilitator, expansion sponsor'),
        operator: T('BUMN Air', 'BUMN Air'),
        assets: T('Tetap milik daerah; aset BOT kembali di akhir konsesi', 'Stays with the region; BOT assets revert at term end'),
        tariff: T('Formula kontrak konsesi, disepakati sekali', 'Concession formula, agreed once at signing'),
        pdam: T('Menjadi Asset Management Company (AMC), dilebur/JV, atau dibubarkan', 'Becomes an Asset Management Company (AMC), merged/JV, or dissolved'),
        link: T('Kontrak konsesi + fee konsesi', 'Concession contract + concession fee'),
        pre: T('Penilaian aset awal; dasar hukum delegasi tarif (UU AMSAN)', 'Baseline asset assessment; legal anchor for tariff delegation (UU AMSAN)'),
        prec: T('Affermage Prancis, Manila, PAAB Malaysia, KSO domestik', 'French affermage, Manila, PAAB Malaysia, domestic KSO'),
      },
      meters: { legal: 1.5, tariff: 2, control: 3 },
      pros: T('Operasi profesional tanpa memindahkan aset; tarif keluar dari siklus politik tahunan. Aset buruk tidak membatalkan model, hanya mengubah urutannya: nilai, rehabilitasi, operasikan, kembangkan.', 'Professional operation without moving assets; tariffs leave the annual political cycle. Poor assets don’t cancel the model, they change its sequence: assess, rehabilitate, operate, expand.'),
      cons: T('Risiko aset lama harus dipisah jelas dari risiko operator; fee konsesi perlu disesuaikan saat rehabilitasi; delegasi tarif butuh payung hukum.', 'Legacy asset risk must be split from operator risk; the fee needs adjusting during rehabilitation; tariff delegation needs a legal anchor.'),
      lens: {
        pemda: T('Tetap pemilik aset dan menerima fee konsesi rutin. Melepas operasi dan penetapan tarif tahunan selama masa konsesi; aset kembali di akhir masa.', 'Keeps asset ownership and receives a regular concession fee. Gives up operations and annual tariff-setting during the term; assets return at the end.'),
        investor: T('Satu operator profesional dengan formula tarif terkunci di kontrak. Ekspansi lewat KPBU/BOT; risiko aset lama dipisahkan dari risiko operator.', 'One professional operator with a tariff formula locked in contract. Expansion via PPP/BOT; legacy asset risk separated from operator risk.'),
        customer: T('Dilayani dan ditagih BUMN Air. Tarif bergerak mengikuti formula yang disepakati, bukan keputusan politik tahunan.', 'Served and billed by BUMN Air. Tariffs move by the agreed formula, not by annual political decisions.'),
      },
    },
    {
      key: 'e2e',
      short: T('End-to-End', 'End-to-End'),
      name: T('Model End-to-End', 'End-to-End Model'),
      tagline: T('Terintegrasi penuh, struktur ala PLN', 'Fully integrated, structured like PLN'),
      summary: T(
        'Satu BUMN mengelola seluruh rantai, dari sumber air sampai pelanggan, lewat unit regional. PDAM dilebur, aset dikonsolidasi, tarif seragam nasional. Daerah terlibat lewat TKD atau Participating Interest ≤49%.',
        'One company runs the whole chain, from source to customer, through regional units. PDAMs are merged, assets consolidated, tariffs uniform nationwide. Regions take part through revenue sharing (TKD) or a Participating Interest ≤49%.'
      ),
      score: {
        role: T('Operator tunggal terintegrasi', 'Single integrated operator'),
        operator: T('BUMN Air (unit regional)', 'BUMN Air (regional units)'),
        assets: T('Dikonsolidasi ke BUMN', 'Consolidated into BUMN'),
        tariff: T('Pusat, seragam nasional', 'Central, uniform nationwide'),
        pdam: T('Dilebur menjadi unit regional BUMN', 'Merged into BUMN regional units'),
        link: T('TKD (bagi hasil) / Participating Interest ≤49%', 'TKD revenue sharing / Participating Interest ≤49%'),
        pre: T('Cabut ±391 Perda; ubah UU 23/2014', 'Revoke ≈391 regional regulations; amend Law 23/2014'),
        prec: T('PLN, SA Water (Australia Selatan), rezim hulu migas', 'PLN, SA Water (South Australia), upstream oil & gas regime'),
      },
      meters: { legal: 3, tariff: 3, control: 3 },
      pros: T('Paling tuntas: satu mitra bankable, tarif nasional, kualitas dan standar layanan konsisten dalam satu garis komando.', 'Most complete: one bankable partner, a national tariff, consistent quality and service standards under one command line.'),
      cons: T('Beban legislasi dan resistensi Pemda terbesar; transisi aset dan SDM ratusan PDAM berskala masif; butuh regulator independen yang kuat.', 'Heaviest legislative load and strongest regional resistance; massive asset and staff transition across hundreds of PDAMs; needs a strong independent regulator.'),
      lens: {
        pemda: T('Melepas PDAM, aset, dan kewenangan tarif. Sebagai gantinya menerima TKD (bagi hasil) dan dapat memegang Participating Interest hingga 49%.', 'Gives up its PDAM, assets and tariff authority. In return it receives TKD revenue sharing and may hold a Participating Interest of up to 49%.'),
        investor: T('Satu entitas berskala nasional dengan neraca terkonsolidasi: mitra paling bankable. Risiko terbesarnya ada di masa transisi, bukan di model akhirnya.', 'One national-scale entity with a consolidated balance sheet: the most bankable partner. Its biggest risk lies in the transition, not the end state.'),
        customer: T('Dilayani langsung oleh BUMN dengan tarif seragam di seluruh Indonesia. Subsidi Pusat menutup selisih tarif sosial.', 'Served directly by BUMN at one tariff across Indonesia. Central subsidy covers the social tariff gap.'),
      },
    },
  ];

  /* ---------- Diagram geometry (viewBox 1000 × 600) ---------- */
  // Entity style keys: gov | bumn | pdam | cust | lost | support
  const stations = [
    { x: 70, label: T('Sumber air', 'Source') },
    { x: 205, label: T('Air baku', 'Raw water') },
    { x: 340, label: T('Produksi (IPA)', 'Treatment') },
    { x: 475, label: T('Transmisi', 'Transmission') },
    { x: 610, label: T('Distribusi', 'Distribution') },
    { x: 745, label: T('Layanan & tagihan', 'Service & billing') },
  ];
  const trackY = 462;
  const custX = 835;

  // Operator of each track segment (6 segments: 5 between stations + last to customer) per model
  const segOperator = [
    ['pdam', 'pdam', 'pdam', 'pdam', 'pdam', 'pdam'],
    ['bumn', 'bumn', 'pdam', 'pdam', 'pdam', 'pdam'],
    ['bumn', 'bumn', 'bumn', 'bumn', 'bumn', 'bumn'],
    ['bumn', 'bumn', 'bumn', 'bumn', 'bumn', 'bumn'],
  ];
  const wasteOperator = ['pdam', 'bumn', 'bumn', 'bumn'];
  // Asset owner per segment per model
  const segAssets = [
    ['pdam', 'pdam', 'pdam', 'pdam', 'pdam', 'pdam'],
    ['bumn', 'bumn', 'pdam', 'pdam', 'pdam', 'pdam'],
    ['pdam', 'pdam', 'pdam', 'pdam', 'pdam', 'pdam'],
    ['bumn', 'bumn', 'bumn', 'bumn', 'bumn', 'bumn'],
  ];
  // Asset band labels per model: [fromSeg, toSeg, text]
  const assetLabels = [
    [[0, 5, T('Milik daerah / PDAM', 'Owned by the region / PDAM')]],
    [[0, 1, T('BUMN (aset hulu)', 'BUMN (upstream assets)')], [2, 5, T('Daerah / PDAM (jaringan distribusi)', 'Region / PDAM (distribution network)')]],
    [[0, 5, T('Tetap milik daerah (AMC) · aset baru BOT kembali di akhir konsesi', 'Stays with the region (AMC) · new BOT assets revert at term end')]],
    [[0, 5, T('Dikonsolidasi ke neraca BUMN Air', 'Consolidated onto BUMN Air’s balance sheet')]],
  ];

  const W = 760; // wide operator node width
  const nodes = {
    pusat: { fixed: [20, 24, 270, 64], style: 'gov', title: T('Pemerintah Pusat', 'Central Government'), sub: T('PU · Kemendagri · Kemenkes · Bappenas · BP BUMN', 'PU · Home Affairs · Health · Bappenas · SOE body') },
    regulator: { fixed: [305, 24, 175, 64], style: 'support', title: T('Badan Regulator', 'Regulatory Body'), sub: T('supervisi · rekomendasi tarif', 'supervision · tariff advice') },
    kemenko: { fixed: [495, 24, 150, 64], style: 'support', title: T('Kemenko IPK', 'Coord. Ministry IPK'), sub: T('pembinaan · koordinasi', 'guidance · coordination') },
    danantara: { fixed: [660, 24, 150, 64], style: 'support', title: T('Danantara', 'Danantara'), sub: T('pemegang saham · PMN', 'shareholder · PMN') },
    investor: { fixed: [825, 24, 155, 64], style: 'support', title: T('Investor & PT SMI', 'Investors & PT SMI'), sub: T('pendanaan · JV · pinjaman', 'funding · JV · loans') },
    pemda: {
      fixed: [20, 140, 180, 58], style: 'gov',
      title: T('Pemerintah Daerah', 'Local Government'),
      sub: [T('pemilik ≥51% · tarif', 'owner ≥51% · tariff'), T('pemilik PDAM · tarif ritel', 'owns PDAM · retail tariff'), T('pemilik aset · pemberi konsesi', 'asset owner · grantor'), T('terima TKD · PI ≤49%', 'receives TKD · PI ≤49%')],
    },
    bumn: {
      rects: [[400, 150, 260, 64], [50, 340, 345, 70], [50, 340, W, 70], [50, 340, W, 70]],
      style: ['bumn', 'bumn', 'bumn', 'bumn'],
      title: [T('BUMN Air · Holding', 'BUMN Air · Holding'), T('BUMN Air · Hulu (Bulk)', 'BUMN Air · Upstream (Bulk)'), T('BUMN Air · Konsesioner', 'BUMN Air · Concessionaire'), T('BUMN Air · End-to-End', 'BUMN Air · End-to-End')],
      sub: [T('penyertaan modal · standar kinerja', 'equity · performance standards'), T('air baku · IPA · IPAL/IPLT (PJT I/II)', 'raw water · treatment · wastewater (PJT I/II)'), T('operasi penuh 25–30 tahun · tagih pelanggan · KPBU/BOT', 'full operation 25–30 years · bills customers · PPP/BOT'), T('unit regional · hulu sampai pelanggan · tarif seragam nasional', 'regional units · source to customer · one national tariff')],
    },
    pdam: {
      rects: [[50, 340, W, 70], [455, 340, 355, 70], [20, 222, 180, 58], [20, 222, 180, 58]],
      style: ['pdam', 'pdam', 'pdam', 'lost'],
      dashed: [0, 0, 0, 1],
      title: [T('PDAM (Perseroda)', 'PDAM (Perseroda)'), T('PDAM · Hilir (Ritel)', 'PDAM · Retail'), T('PDAM → AMC', 'PDAM → AMC'), T('PDAM eksisting', 'Existing PDAM')],
      sub: [T('produksi · distribusi · tagihan · milik daerah', 'production · distribution · billing · locally owned'), T('distribusi · tagihan · milik daerah', 'distribution · billing · locally owned'), T('pengelola aset milik daerah', 'manages local assets'), T('dilebur jadi unit regional', 'merged into regional units')],
    },
    cust: {
      fixed: [custX, 432, 145, 60], style: 'cust',
      title: T('Pelanggan', 'Customers'),
      sub: [T('bayar tarif lokal ke PDAM', 'pay local tariff to PDAM'), T('bayar tarif ritel ke PDAM', 'pay retail tariff to PDAM'), T('bayar tarif formula ke BUMN', 'pay formula tariff to BUMN'), T('bayar tarif nasional ke BUMN', 'pay national tariff to BUMN')],
    },
  };

  /* Flows. kind: money | auth | asset.  on: presence per model (0..1).
     a/b: [node, side, frac]. node may be an array per model.
     label: string or per-model array; lt: label position on curve; lo: [dx,dy] label offset. */
  const flows = [
    // governance — present in every model, unlabeled (the chips explain them)
    { id: 'g-mandate', kind: 'auth', on: [1, 1, 1, 1], a: ['pusat', 'b', 0.8], b: ['bumn', 't', 0.36],
      label: [null, T('mandat · PSO', 'mandate · PSO'), null, T('penugasan · tarif · subsidi', 'assignment · tariff · subsidy')], lt: 0.74, lo: [0, 0] },
    { id: 'g-reg', kind: 'auth', on: [1, 1, 1, 1], a: ['regulator', 'b', 0.5], b: ['bumn', 't', 0.48] },
    { id: 'g-coord', kind: 'auth', on: [1, 1, 1, 1], a: ['kemenko', 'b', 0.5], b: ['bumn', 't', 0.62] },
    { id: 'g-equity', kind: 'money', on: [1, 1, 1, 1], a: ['danantara', 'b', 0.3], b: ['bumn', 't', 0.74] },
    { id: 'g-div', kind: 'money', on: [1, 1, 1, 1], a: ['bumn', 't', 0.84], b: ['danantara', 'b', 0.62] },
    { id: 'g-fin', kind: 'money', on: [1, 1, 1, 1], a: ['investor', 'b', 0.4], b: ['bumn', 't', 0.95] },

    // Holding
    { id: 'h-own', kind: 'auth', on: [1, 0, 0, 0], a: ['pemda', 'b', 0.5], b: ['pdam', 't', 0.07], label: T('≥51% · tarif', '≥51% · tariff'), lt: 0.5, lo: [52, 0] },
    { id: 'h-equity', kind: 'money', on: [1, 0, 0, 0], a: ['bumn', 'b', 0.45], b: ['pdam', 't', 0.55], label: T('penyertaan modal ≤49%', 'equity ≤49%'), lt: 0.5, lo: [0, 0] },

    // Bulk
    { id: 'b-own', kind: 'auth', on: [0, 1, 0, 0], a: ['pemda', 'r', 0.5], b: ['pdam', 't', 0.45], label: T('pemilik · tarif ritel', 'owner · retail tariff'), lt: 0.55, lo: [0, 0] },
    { id: 'b-wpa', kind: 'money', on: [0, 1, 0, 0], a: ['pdam', 't', 0.1], b: ['bumn', 't', 0.98], label: T('bayar air curah (WPA) + tipping fee', 'pays bulk water (WPA) + tipping fee'), lt: 0.5, lo: [0, -12] },

    // Concession
    { id: 'k-own', kind: 'auth', on: [0, 0, 1, 0], a: ['pemda', 'b', 0.5], b: ['pdam', 't', 0.5], label: T('pemilik', 'owner'), lt: 0.5, lo: [36, 0] },
    { id: 'k-right', kind: 'auth', on: [0, 0, 1, 0], a: ['pdam', 'b', 0.25], b: ['bumn', 't', 0.04], label: T('konsesi 25–30 th', '25–30 yr concession'), lt: 0.5, lo: [8, 0], anchor: 'start' },
    { id: 'k-fee', kind: 'money', on: [0, 0, 1, 0], a: ['bumn', 't', 0.2], b: ['pdam', 'b', 0.88], label: T('fee konsesi', 'concession fee'), lt: 0.5, lo: [8, 0], anchor: 'start' },

    // End-to-End
    { id: 'e-absorb', kind: 'asset', on: [0, 0, 0, 1], a: ['pdam', 'b', 0.3], b: ['bumn', 't', 0.07], label: T('aset diserahkan', 'assets handed over'), lt: 0.5, lo: [8, 0], anchor: 'start' },
    { id: 'e-tkd', kind: 'money', on: [0, 0, 0, 1], a: ['bumn', 't', 0.25], b: ['pemda', 'r', 0.75], label: T('TKD (bagi hasil)', 'TKD revenue share'), lt: 0.5, lo: [30, 0] },

    // Customers pay the operator
    { id: 'c-pay', kind: 'money', on: [1, 1, 1, 1], a: ['cust', 't', 0.35], b: [['pdam', 'pdam', 'bumn', 'bumn'], 'r', 0.5],
      label: [T('tarif lokal', 'local tariff'), T('tarif ritel', 'retail tariff'), T('tarif formula', 'formula tariff'), T('tarif seragam', 'uniform tariff')], lt: 0.45, lo: [0, -2] },
  ];

  /* ---------- Recommendation: 3 channels ---------- */
  const channels = [
    {
      key: 'jv',
      name: T('Kanal 1 · Joint Venture', 'Channel 1 · Joint Venture'),
      fit: T('BUMD sehat dan siap bermitra', 'Healthy BUMD, ready to partner'),
      structure: T('JV dengan BUMN ≥51% dan BUMD ≤49% mengoperasikan hulu sampai ritel.', 'A JV, BUMN ≥51% and BUMD ≤49%, runs upstream through retail.'),
      structureVariant: T('JV mengelola hulu (bulk systems); ritel tetap di BUMD.', 'The JV runs upstream (bulk systems); retail stays with the BUMD.'),
      pemda: T('Memegang saham ≤49% melalui BUMD.', 'Holds ≤49% of shares through its BUMD.'),
      contract: T('Perjanjian pemegang saham (JV Agreement)', 'Shareholders’ agreement (JV Agreement)'),
      up: 'jv', down: 'jv', downVariant: 'pdam',
      upLabel: T('JV · bulk systems', 'JV · bulk systems'), downLabel: T('JV · distribusi ritel', 'JV · retail'), downLabelVariant: T('BUMD · distribusi ritel', 'BUMD · retail'),
      link: T('JV Agreement', 'JV Agreement'), linkVariant: T('WPA', 'WPA'),
    },
    {
      key: 'bulk',
      name: T('Kanal 2 · Bulk Services', 'Channel 2 · Bulk Services'),
      fit: T('BUMD kuat di sisi distribusi', 'BUMD strong in distribution'),
      structure: T('BUMN mengelola hulu dan menjual air curah ke BUMD. Aset hulu dialihkan ke BUMN; jaringan distribusi tetap milik daerah.', 'BUMN runs upstream and sells bulk water to the BUMD. Upstream assets move to BUMN; the distribution network stays local.'),
      pemda: T('Pemilik BUMD; menetapkan tarif ritel.', 'Owns the BUMD; sets the retail tariff.'),
      contract: T('Jual-beli air curah (WPA) + tipping fee air limbah', 'Bulk water purchase (WPA) + wastewater tipping fee'),
      up: 'bumn', down: 'pdam',
      upLabel: T('BUMN · bulk services', 'BUMN · bulk services'), downLabel: T('BUMD · distribusi ritel', 'BUMD · retail'),
      link: T('WPA + tipping fee', 'WPA + tipping fee'),
    },
    {
      key: 'e2e',
      name: T('Kanal 3 · End-to-End', 'Channel 3 · End-to-End'),
      fit: T('3T, KEK/KI, IKN & kawasan baru, atau tanpa BUMD sehat', '3T regions, SEZ/industrial estates, IKN & new towns, or no healthy BUMD'),
      structure: T('BUMN mengelola hulu sampai ritel dan melayani pelanggan langsung, dengan tarif dari Pusat.', 'BUMN runs upstream to retail and serves customers directly, at a centrally set tariff.'),
      pemda: T('Memberi izin dan persetujuan wilayah; menerima PI/TKD.', 'Grants permits and regional approval; receives PI/TKD.'),
      contract: T('Integrasi internal, tanpa transaksi antar-entitas', 'Internal integration, no inter-entity transaction'),
      up: 'bumn', down: 'bumn',
      upLabel: T('BUMN · rantai hulu', 'BUMN · upstream chain'), downLabel: T('BUMN · ritel langsung', 'BUMN · direct retail'),
      link: T('internal', 'internal'),
    },
  ];

  /* Mini-schematic states for the recommendation view: jv, jv-variant, bulk, e2e */
  const recStates = {
    jv: {
      up: 'jv', down: 'jv', l2: 1, l3dash: 0,
      l1: T('≥51% BUMN', '≥51% BUMN'), l2t: T('≥51% BUMN', '≥51% BUMN'), l3: T('≤49% via BUMD', '≤49% via BUMD'),
      pemda: T('mitra JV lewat BUMD', 'JV partner via BUMD'),
    },
    jvVar: {
      up: 'jv', down: 'pdam', l2: 0, l3dash: 0,
      l1: T('≥51% BUMN', '≥51% BUMN'), l2t: T('', ''), l3: T('pemilik BUMD', 'owns BUMD'),
      pemda: T('mitra JV · pemilik BUMD', 'JV partner · owns BUMD'),
      contract: T('JV Agreement · WPA antara JV dan BUMD', 'JV Agreement · WPA between JV and BUMD'),
    },
    bulk: {
      up: 'bumn', down: 'pdam', l2: 0, l3dash: 0,
      l1: T('milik BUMN', 'owned by BUMN'), l2t: T('', ''), l3: T('pemilik · tarif ritel', 'owner · retail tariff'),
      pemda: T('pemilik BUMD · tarif ritel', 'owns BUMD · retail tariff'),
    },
    e2e: {
      up: 'bumn', down: 'bumn', l2: 1, l3dash: 1,
      l1: T('milik BUMN', 'owned by BUMN'), l2t: T('milik BUMN', 'owned by BUMN'), l3: T('izin · PI/TKD', 'permits · PI/TKD'),
      pemda: T('izin wilayah · PI/TKD', 'permits · PI/TKD'),
    },
  };

  const meterWords = {
    legal: [T('ringan', 'light'), T('sedang', 'moderate'), T('rendah–sedang', 'low–moderate'), T('berat', 'heavy')],
    tariff: [T('tidak', 'no'), T('sebagian', 'partly'), T('sebagian, lewat kontrak', 'partly, by contract'), T('penuh', 'fully')],
    control: [T('minim', 'minimal'), T('hulu saja', 'upstream only'), T('penuh', 'full'), T('penuh', 'full')],
  };

  /* ---------- Tour ---------- */
  const tour = [
    { section: 'problem', text: T('Hari ini: 391 PDAM, masing-masing dengan tarif dan neraca sendiri. Terlalu kecil untuk dibiayai, terlalu tersebar untuk distandarkan.', 'Today: 391 PDAMs, each with its own tariff and balance sheet. Too small to finance, too scattered to standardise.') },
    { section: 'models', pos: 0, focus: 'gov', text: T('Lapisan atas tidak berubah di semua model: Pusat memberi mandat, Regulator mengawasi, Danantara memegang saham, investor dan PT SMI membiayai lewat BUMN Air.', 'The top layer is the same in every model: the centre mandates, the Regulator supervises, Danantara holds the shares, investors and PT SMI finance through BUMN Air.') },
    { section: 'models', pos: 0, text: T('Holding: BUMN Air menggantung jauh dari pelanggan. Ia hanya menanam modal (≤49%) di PDAM. Seluruh rantai tetap hijau, milik dan dioperasikan daerah.', 'Holding: BUMN Air hangs far from customers. It only invests equity (≤49%) in PDAMs. The whole chain stays green, owned and run locally.') },
    { section: 'models', pos: 1, text: T('Bulk: BUMN Air turun mengambil hulu. Garis berubah oranye sampai IPA, lalu air curah dijual ke PDAM lewat kontrak WPA.', 'Bulk: BUMN Air takes over the upstream. The line turns orange up to treatment, then bulk water is sold to PDAMs under a WPA.') },
    { section: 'models', pos: 2, text: T('Konsesi: BUMN Air mengoperasikan seluruh rantai, tetapi lihat pita aset di bawah: tetap hijau. Daerah tetap memiliki aset dan menerima fee konsesi.', 'Concession: BUMN Air runs the whole chain, but look at the asset band below: still green. The region keeps the assets and receives a concession fee.') },
    { section: 'models', pos: 3, focus: 'assets', text: T('End-to-End: operasinya sama dengan Konsesi, tetapi kini aset pun berpindah ke BUMN dan PDAM dilebur. Daerah mendapat TKD dan PI ≤49%.', 'End-to-End: the same operation as Concession, but now the assets move to BUMN too and PDAMs are merged. Regions get TKD and PI ≤49%.') },
    { section: 'rec', channel: 0, text: T('Rekomendasi: tidak memilih satu model untuk semua. Wilayah dengan BUMD sehat bermitra lewat joint venture.', 'Recommendation: no single model for everyone. Regions with a healthy BUMD partner through a joint venture.') },
    { section: 'rec', channel: 2, text: T('Wilayah 3T, KEK, IKN, atau tanpa BUMD sehat dilayani BUMN langsung, end-to-end. Di antaranya: bulk services untuk BUMD yang kuat di distribusi.', '3T regions, SEZs, IKN or areas without a healthy BUMD are served by BUMN directly, end-to-end. In between: bulk services for BUMDs strong in distribution.') },
  ];

  /* ---------- Archipelago (illustrative) — ellipses: cx, cy, rx, ry, rotDeg, share ---------- */
  const islands = [
    [150, 120, 128, 30, 38, 0.29],  // Sumatra
    [375, 262, 118, 17, 6, 0.23],   // Java
    [545, 285, 88, 9, 2, 0.08],     // Bali & Nusa Tenggara
    [415, 128, 80, 70, 0, 0.11],    // Kalimantan
    [612, 150, 18, 62, 8, 0.09],    // Sulawesi spine
    [655, 108, 48, 11, -8, 0.04],   // Sulawesi north arm
    [652, 196, 36, 10, 32, 0.03],   // Sulawesi SE arm
    [752, 168, 26, 42, 0, 0.04],    // Maluku
    [885, 196, 92, 40, 10, 0.08],   // Papua
  ];

  return { ui, models, stations, trackY, custX, segOperator, wasteOperator, segAssets, assetLabels, nodes, flows, channels, recStates, meterWords, tour, islands };
})();
