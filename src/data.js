export const FLAGS = {
  "Qatar":"🇶🇦","Ecuador":"🇪🇨","Senegal":"🇸🇳","Países Bajos":"🇳🇱",
  "Inglaterra":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","EE.UU.":"🇺🇸","Irán":"🇮🇷","Gales":"🏴󠁧󠁢󠁷󠁬󠁳󠁿",
  "Argentina":"🇦🇷","Arabia Saudí":"🇸🇦","México":"🇲🇽","Polonia":"🇵🇱",
  "Francia":"🇫🇷","Australia":"🇦🇺","Dinamarca":"🇩🇰","Túnez":"🇹🇳",
  "España":"🇪🇸","Costa Rica":"🇨🇷","Alemania":"🇩🇪","Japón":"🇯🇵",
  "Bélgica":"🇧🇪","Canadá":"🇨🇦","Marruecos":"🇲🇦","Croacia":"🇭🇷",
  "Brasil":"🇧🇷","Serbia":"🇷🇸","Suiza":"🇨🇭","Camerún":"🇨🇲",
  "Portugal":"🇵🇹","Ghana":"🇬🇭","Uruguay":"🇺🇾","Corea del Sur":"🇰🇷",
}

// Plantillas de cada selección (basadas en prelistas oficiales Mundial 2026)
export const SQUADS = {
  "Qatar": ["Al-Sheeb","Barsham","Al-Rawi","Salman","Al-Haydos","Afif","Ali","Hassan","Khoukhi","Boudiaf","Al-Ahrak","Muntari","Pedro Miguel","Boualem Khoukhi","Al-Naemi","Koybasi","Abdelkarim","Al-Harthi","Yusuf","Romero","Jawad","Al-Ali","Amine","Ismail","Khidir","Meshaal"],
  "Ecuador": ["Galíndez","Ramírez","Preciado","Torres","Arboleda","Plata","Caicedo","Sarmiento","Estrada","Valencia","Mena","Gruezo","Reasco","Méndez","Hincapié","Porozo","Ibarra","Angulo","Loor","Cortez","Corozo","Troya","Rodríguez","Bone","Nazareno","Palacios"],
  "Senegal": ["Mendy","Gomis","Diallo","Koulibaly","Saliou","Sabaly","Ciss","Gana","Kouyaté","Mané","Diatta","Diedhiou","Niakhaté","Lopy","Sarr","Jakobs","Ndiaye","Mbaye","Dieng","Badji","Thioune","Pape","Kalifa","Bamba","Mboup","Kouyaté B"],
  "Países Bajos": ["Flekken","Bijlow","Verbruggen","Dumfries","De Vrij","Timber","Blind","Van Dijk","Ake","Frimpong","De Jong","Koopmeiners","Gakpo","Simons","Reijnders","Veerman","Van de Ven","Gravenberch","Malen","Bergwijn","Weghorst","Depay","Zirkzee","Lang","Van den Berg","Wieffer"],
  "Inglaterra": ["Pickford","Ramsdale","Flaherty","Alexander-Arnold","Trippier","Walker","Gomez","Maguire","Stones","Shaw","Chilwell","Bellingham","Rice","Henderson","Gallagher","Winks","Saka","Rashford","Foden","Sterling","Toney","Kane","Watkins","Archer","Bowen","Dunk"],
  "EE.UU.": ["Turner","Steffen","Horvath","Dest","Ream","Richards","Robinson","Long","McKennie","Musah","Adams","Tillman","Pulisic","Reyna","Weah","Sargent","Ferreira","Wright","Balogun","Morris","Carter-Vickers","Scally","Acosta","Roldan","Yueill","Shaq Moore"],
  "Irán": ["Beiranvand","Hosseini","Abedzadeh","Rezaeian","Pouraliganji","Mohammadi","Ezatolahi","Karimi","Jahanbakhsh","Taremi","Azmoun","Cheshmi","Noorollahi","Gholizadeh","Makani","Hajsafi","Torabi","Amiri","Moharrami","Sarlak","Mousavi","Shajari","Borhan","Jalali","Bagheri","Shojaei"],
  "Gales": ["Ward","Davies A","Hennessey","Roberts","Gunter","Rodon","Mepham","Williams","Davies B","Allen","Wilson","Ramsey","James","Bale","Moore","Brooks","Levitt","Cabango","Norrington-Davies","Matondo","Harris","Burns","Johnson","Thomas","Colwill","Vaulks"],
  "Argentina": ["E.Martínez","Rulli","Musso","Montiel","Molina","Otamendi","Lisandro","Romero","Acuña","Tagliafico","De Paul","E.Fernández","Mac Allister","Paredes","Fernández","Lo Celso","Messi","Di María","Lautaro","J.Álvarez","Correa","N.González","Dybala","Ángel Correa","Garnacho","Mastantuono"],
  "Arabia Saudí": ["Al-Owais","Al-Rubaie","Al-Yami","Sultan","Al-Amri","Al-Tambakti","Albulayhi","Al-Shahrani","Al-Faraj","Kanno","Al-Malki","Al-Hamdan","Al-Dawsari","Bahebri","Ghareeb","Alshehri","Al-Najei","Al-Buraikan","Al-Qahtani","Asiri","Abulizi","Al-Khaibri","Saleh","Albahri","Fallatah","Khalid"],
  "México": ["Ochoa","Cota","Talavera","Sánchez","Gallardo","Moreno","Montes","Vásquez","Hernández","Araujo","Herrera","Guardado","Lozano","Corona","Jiménez","Martín","Antuna","Álvarez","Angulo","Lainez","Vega","Santi Giménez","Orrantia","Malcorra","Buendia","Macías"],
  "Polonia": ["Szczesny","Grabara","Bulka","Cash","Bednarek","Glik","Kiwior","Bereszynski","Frankowski","Zielinski","Krychowiak","Moder","Szymanski","Zalewski","Swiderski","Milik","Lewandowski","Piatek","Skóras","Buksa","Grosicki","Kamiński","Piotrowski","Urbanski","Ameyaw","Dawidowicz"],
  "Francia": ["Lloris","Maignan","Mandanda","Pavard","Varane","Koundé","Theo","Digne","Camavinga","Tchouaméni","Griezmann","Mbappé","Giroud","Dembélé","Benzema","Thuram","Coman","Saliba","Guendouzi","Rabiot","Sarr","Kante","Konaté","Hernández","Nkunku","Clauss"],
  "Australia": ["Ryan","Vukovic","Redmayne","Atkinson","Degenek","Rowles","Souttar","Behich","Karacic","Mooy","Leckie","McGree","Irvine","Aiden","Maclaren","Cummings","Wright","Nabbout","Hrustic","Nisbet","Ryan P","Devlin","Jamieson","Flórence","Giantsopoulos","Najjar"],
  "Dinamarca": ["Schmeichel","Ronnow","Grabara","Wass","Andersen","Boilesen","Nelsson","Christensen","Maehle","Hojbjerg","Eriksen","Norgaard","Skov Olsen","Damsgaard","Braithwaite","Wind","Dolberg","Poulsen","Bah","Lindstrom","Ankersen","Dreyer","Greve","Rohde","Daramy","Cornelius"],
  "Túnez": ["Dahmen","Ben Said","Jemai","Meriah","Talbi","Bronn","Mathlouthi","Drager","Rekik","Laïdouni","Msakni","Khazri","Ben Romdhane","Ouni","Sliti","Karoui","Sfaxi","Chaalali","Ghandri","Abdi","Boujelbene","Jaziri","Hannibal","Benchama","Ifa","Sassi"],
  "España": ["Unai Simón","Raya","Remiro","Carvajal","Porro","Laporte","Pau Cubarsí","Huijsen","Le Normand","Cucurella","Grimaldo","Pedri","Rodri","Zubimendi","Merino","Fabián","Barrios","Yamal","Nico Williams","Dani Olmo","Ferran Torres","Morata","Oyarzabal","Ansu Fati","Santi Denia","Marcos Llorente"],
  "Costa Rica": ["Navas","Sequeira","Vargas","Waston","Duarte","Calvo","Matarrita","Oviedo","Borges","Tejeda","Ruiz","Bolaños","Campbell","Urena","Venegas","Contreras","Galo","Torres","Aguilera","Bennette","Mora","Brenes","Salas","Sáenz","Leal","Hernández"],
  "Alemania": ["Neuer","ter Stegen","Trapp","Kimmich","Rüdiger","Schlotterbeck","Süle","Raum","Gündogan","Kroos","Goretzka","Musiala","Gnabry","Havertz","Müller","Werner","Sané","Wirtz","Brandt","Hofmann","Kehrer","Klostermann","Henrichs","Anton","Adeyemi","Nmecha"],
  "Japón": ["Suzuki Z","Osako","Hayakawa","Nagamoto","Taniguchi","Itakura","Tomisayu","Seko","Sugawara","Ito","Suzuki J","Watanabe","Sano","Endo","Tanaka","Kamada","Ito J","Mitoma","Kubo","Doan","Maeda","Ueda","Furuhashi","Nakamura","Tsukasa","Soma"],
  "Bélgica": ["Courtois","Mignolet","Casteels","Alderweireld","Vertonghen","Boyata","Meunier","Theate","De Bruyne","Tielemans","Witsel","Vanaken","Castagne","Doku","Lukaku","Batshuayi","Carrasco","Hazard","Openda","Onana","Saelemaekers","Mangala","Faes","Lukebakio","Ngoy","Lavia"],
  "Canadá": ["Borjan","Crepeau","Pannaccio","Johnston","Vitoria","Adekugbe","Miller","Kamal","Eustaquio","Laryea","Osorio","Hutchinson","Davies","Buchanan","Larin","David","Cavallini","De Peña","Henry","Millar","Hoilett","Fraser","Kone","Waterman","Cornelius B","Charles-Cook"],
  "Marruecos": ["Bounou","El Kaabi","Zniti","Hakimi","Saiss","El Yamiq","Dari","Mazraoui","Attiat-Allah","Amrabat","Amallah","Ounahi","Ziyech","Boufal","En-Nesyri","Sabiri","Aguerd","Benoun","Aziz","Ezzalzouli","Iajour","Aouar","Benali","Louza","Cheddira","Belkhir"],
  "Croacia": ["Livakovic","Grbic","Ivusic","Juranovic","Gvardiol","Sutalo","Caleta-Car","Barisic","Erlic","Modric","Kovacic","Brozovic","Kramaric","Vlasic","Perisic","Pasalic","Sucic","Ivanusec","Orsic","Livaja","Majer","Sosa","Stanisic","Jakic","Pjaca","Budimir"],
  "Brasil": ["Alisson","Ederson","Weverton","Alex Sandro","Bremer","Danilo","Douglas Santos","Gabriel","Roger Ibañez","Léo Pereira","Marquinhos","Wesley","Bruno Guimaraes","Casemiro","Danilo S","Fabinho","Lucas Paquetá","Endrick","Gabriel Martinelli","Igor Thiago","Luiz Henrique","Matheus Cunha","Neymar","Raphinha","Vinícius Jr","Rayan"],
  "Serbia": ["Stojkovic","Rajkovic","Dmitrovic","Milenkovic","Pavlovic N","Veljkovic","Babic","Spajic","Lazovic","Lukic","Tadic","Milinkovic-Savic","Kostic","Jovic","Vlahovic","Zivkovic","Ilic S","Grujic","Mitrovic","Maksimovic","Racic","Mladenovic","Djuricic","Lazaro","Mandic","Gudelj"],
  "Suiza": ["Kobel","Mvogo","Keller","Akanji","Elvedi","Comert","Rodriguez","Widmer","Aebischer","Xhaka","Zakaria","Freuler","Okafor","Vargas","Seferovic","Embolo","Steffen","Fabian Rieder","Ndoye","Fassnacht","Shaqiri","Amenda","Jaquez","Muheim","Fernandes","Monteiro"],
  "Camerún": ["Onana","Epassy","Nkoulou","Tolo","Fai","Castelletto","Ngadeu","Nyom","Anguissa","Mbeumo","Choupo-Moting","Ntcham","Toko Ekambi","Bassogog","Ngamaleu","Gouet","Kunde","Aboubakar","Lekhal","Hongla","Marou","Ottou","Mfulu","Nanga","Boumal","Siani"],
  "Portugal": ["Costa D","Rui Patrício","Cláudio Ramos","Cancelo","Pepe","Rúben Dias","Guerreiro","Nuno Mendes","Danilo","Palhinha","Bruno Fernandes","Bernardo","João Mário","Vitinha","Horta","Cristiano","Leão","Gonçalo Ramos","Félix","Trincão","André Silva","Otávio","R.Neves","Bruma","Neto","Jota"],
  "Ghana": ["Ati-Zigi","Wollacott","Amey","Salisu","Amartey","Djiku","Mensah","Baba","Ayew A","Ayew J","Thomas","Partey","Kudus","Saka","Issahaku","Osman","Sulemana","Acquah","Kyereh","Wireko","Asante","Boateng","Plange","Cudjoe","Opoku","Antwi"],
  "Uruguay": ["Muslera","Rochet","Campana","Giménez J","Godin","Caceres","Araujo","Olivera","Nandez","Torreira","Valverde","Bentancur","De Arrascaeta","Pellistri","Suárez","Cavani","Alonso","Ugarte","Maxi Gómez","Viña","Lacroix","Fede Valverde","Mathías Olivera","Canobbio","Piquerez","Méndez"],
  "Corea del Sur": ["Kim Seung-Gyu","Song Bum Keun","Jo Hyeon-Woo","Kim Moon-Hwan","Kim Min-Jae","Kim Tae-Hwan","Park Jin-Seob","Seol Young-Woo","Jens Castrop","Lee Ki-Hyuk","Lee Tae-Seok","Lee Han-Beom","Kim Jin-Gyu","Bae Jun-Ho","Paik Seung-Ho","Yang Hyun-Jun","Eom Ji-Sung","Lee Kang-In","Lee Dong-Gyeong","Lee Jae-Sung","Hwang In-Beom","Hwang Hee-Chan","Son Heung-Min","Oh Hyeon-Gyu","Cho Gue-Sung","Lee Chang-Hyun"],
}

export const GROUPS = {
  A:{teams:["Qatar","Ecuador","Senegal","Países Bajos"],matches:[
    {id:"A1",home:"Qatar",away:"Ecuador",date:"2026-06-11T17:00"},
    {id:"A2",home:"Senegal",away:"Países Bajos",date:"2026-06-12T14:00"},
    {id:"A3",home:"Qatar",away:"Senegal",date:"2026-06-16T11:00"},
    {id:"A4",home:"Países Bajos",away:"Ecuador",date:"2026-06-16T14:00"},
    {id:"A5",home:"Ecuador",away:"Senegal",date:"2026-06-20T18:00"},
    {id:"A6",home:"Países Bajos",away:"Qatar",date:"2026-06-20T18:00"},
  ]},
  B:{teams:["Inglaterra","EE.UU.","Irán","Gales"],matches:[
    {id:"B1",home:"Inglaterra",away:"Irán",date:"2026-06-13T14:00"},
    {id:"B2",home:"EE.UU.",away:"Gales",date:"2026-06-13T20:00"},
    {id:"B3",home:"Gales",away:"Irán",date:"2026-06-17T11:00"},
    {id:"B4",home:"Inglaterra",away:"EE.UU.",date:"2026-06-17T20:00"},
    {id:"B5",home:"Gales",away:"Inglaterra",date:"2026-06-21T18:00"},
    {id:"B6",home:"Irán",away:"EE.UU.",date:"2026-06-21T18:00"},
  ]},
  C:{teams:["Argentina","Arabia Saudí","México","Polonia"],matches:[
    {id:"C1",home:"Argentina",away:"Arabia Saudí",date:"2026-06-14T11:00"},
    {id:"C2",home:"México",away:"Polonia",date:"2026-06-14T17:00"},
    {id:"C3",home:"Polonia",away:"Arabia Saudí",date:"2026-06-18T11:00"},
    {id:"C4",home:"Argentina",away:"México",date:"2026-06-18T20:00"},
    {id:"C5",home:"Polonia",away:"Argentina",date:"2026-06-22T18:00"},
    {id:"C6",home:"Arabia Saudí",away:"México",date:"2026-06-22T18:00"},
  ]},
  D:{teams:["Francia","Australia","Dinamarca","Túnez"],matches:[
    {id:"D1",home:"Dinamarca",away:"Túnez",date:"2026-06-14T14:00"},
    {id:"D2",home:"Francia",away:"Australia",date:"2026-06-14T20:00"},
    {id:"D3",home:"Túnez",away:"Australia",date:"2026-06-18T14:00"},
    {id:"D4",home:"Francia",away:"Dinamarca",date:"2026-06-18T17:00"},
    {id:"D5",home:"Australia",away:"Dinamarca",date:"2026-06-22T18:00"},
    {id:"D6",home:"Túnez",away:"Francia",date:"2026-06-22T18:00"},
  ]},
  E:{teams:["España","Costa Rica","Alemania","Japón"],matches:[
    {id:"E1",home:"Alemania",away:"Japón",date:"2026-06-15T14:00"},
    {id:"E2",home:"España",away:"Costa Rica",date:"2026-06-15T17:00"},
    {id:"E3",home:"Japón",away:"Costa Rica",date:"2026-06-19T11:00"},
    {id:"E4",home:"España",away:"Alemania",date:"2026-06-19T20:00"},
    {id:"E5",home:"Japón",away:"España",date:"2026-06-23T18:00"},
    {id:"E6",home:"Costa Rica",away:"Alemania",date:"2026-06-23T18:00"},
  ]},
  F:{teams:["Bélgica","Canadá","Marruecos","Croacia"],matches:[
    {id:"F1",home:"Marruecos",away:"Croacia",date:"2026-06-15T11:00"},
    {id:"F2",home:"Bélgica",away:"Canadá",date:"2026-06-15T20:00"},
    {id:"F3",home:"Bélgica",away:"Marruecos",date:"2026-06-19T14:00"},
    {id:"F4",home:"Croacia",away:"Canadá",date:"2026-06-19T17:00"},
    {id:"F5",home:"Croacia",away:"Bélgica",date:"2026-06-23T18:00"},
    {id:"F6",home:"Canadá",away:"Marruecos",date:"2026-06-23T18:00"},
  ]},
  G:{teams:["Brasil","Serbia","Suiza","Camerún"],matches:[
    {id:"G1",home:"Brasil",away:"Serbia",date:"2026-06-24T20:00"},
    {id:"G2",home:"Suiza",away:"Camerún",date:"2026-06-24T17:00"},
    {id:"G3",home:"Camerún",away:"Serbia",date:"2026-06-28T11:00"},
    {id:"G4",home:"Brasil",away:"Suiza",date:"2026-06-28T17:00"},
    {id:"G5",home:"Serbia",away:"Suiza",date:"2026-07-02T18:00"},
    {id:"G6",home:"Camerún",away:"Brasil",date:"2026-07-02T18:00"},
  ]},
  H:{teams:["Portugal","Ghana","Uruguay","Corea del Sur"],matches:[
    {id:"H1",home:"Uruguay",away:"Corea del Sur",date:"2026-06-24T14:00"},
    {id:"H2",home:"Portugal",away:"Ghana",date:"2026-06-24T11:00"},
    {id:"H3",home:"Corea del Sur",away:"Ghana",date:"2026-06-28T14:00"},
    {id:"H4",home:"Portugal",away:"Uruguay",date:"2026-06-28T20:00"},
    {id:"H5",home:"Ghana",away:"Uruguay",date:"2026-07-02T18:00"},
    {id:"H6",home:"Corea del Sur",away:"Portugal",date:"2026-07-02T18:00"},
  ]},
}

// 4 criterios de puntuación
export const DEF_PTS = { exact: 3, sign: 1, scorer: 2, minute: 1 }

export function fmtDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('es-ES', { weekday:'short', day:'numeric', month:'short' }) +
    ' · ' + d.toLocaleTimeString('es-ES', { hour:'2-digit', minute:'2-digit' })
}

export function isOpen(iso) {
  return new Date() < new Date(new Date(iso).getTime() - 60000)
}

export function timeLeft(iso) {
  const diff = new Date(iso) - new Date() - 60000
  if (diff <= 0) return null
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function getSign(hg, ag) {
  if (hg > ag) return 'H'
  if (hg < ag) return 'A'
  return 'D'
}

export function calcPoints(bet, result, pts) {
  if (!bet || !result || result.home_goals === undefined) return null
  let p = 0
  const betSign = getSign(bet.home_goals, bet.away_goals)
  const resSign = getSign(result.home_goals, result.away_goals)

  // Resultado exacto
  if (bet.home_goals === result.home_goals && bet.away_goals === result.away_goals) p += pts.exact
  // Signo correcto (victoria local/empate/victoria visitante)
  if (betSign === resSign) p += pts.sign
  // Goleador
  if (bet.scorer && result.scorer && bet.scorer === result.scorer) p += pts.scorer
  // Minuto
  if (bet.minute && result.minute && +bet.minute === +result.minute) p += pts.minute
  return p
}

export function calcPointsBreakdown(bet, result, pts) {
  if (!bet || !result || result.home_goals === undefined) return null
  const betSign = getSign(bet.home_goals, bet.away_goals)
  const resSign = getSign(result.home_goals, result.away_goals)
  return {
    exact: (bet.home_goals === result.home_goals && bet.away_goals === result.away_goals) ? pts.exact : 0,
    sign: betSign === resSign ? pts.sign : 0,
    scorer: (bet.scorer && result.scorer && bet.scorer === result.scorer) ? pts.scorer : 0,
    minute: (bet.minute && result.minute && +bet.minute === +result.minute) ? pts.minute : 0,
  }
}
