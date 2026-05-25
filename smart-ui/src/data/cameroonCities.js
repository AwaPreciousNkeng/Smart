// All major cities and towns across Cameroon's 10 regions
export const cameroonCities = [
  // Littoral
  { name:'Douala',       region:'Littoral',   lat:4.0511,  lng:9.7679,  pop:'3.8M', type:'metro',   monitored:true  },
  { name:'Nkongsamba',   region:'Littoral',   lat:4.9500,  lng:9.9333,  pop:'150K', type:'city',    monitored:false },
  { name:'Edéa',         region:'Littoral',   lat:3.8000,  lng:10.1333, pop:'90K',  type:'city',    monitored:false },
  // Centre
  { name:'Yaoundé',      region:'Centre',     lat:3.8667,  lng:11.5167, pop:'3.5M', type:'capital', monitored:true  },
  { name:'Mbalmayo',     region:'Centre',     lat:3.5167,  lng:11.5000, pop:'60K',  type:'town',    monitored:false },
  { name:'Obala',        region:'Centre',     lat:4.1667,  lng:11.5333, pop:'40K',  type:'town',    monitored:false },
  // South-West
  { name:'Buea',         region:'South-West', lat:4.1557,  lng:9.2432,  pop:'200K', type:'city',    monitored:true  },
  { name:'Limbe',        region:'South-West', lat:4.0165,  lng:9.2057,  pop:'150K', type:'city',    monitored:true  },
  { name:'Kumba',        region:'South-West', lat:4.6333,  lng:9.4500,  pop:'250K', type:'city',    monitored:false },
  { name:'Tiko',         region:'South-West', lat:4.0786,  lng:9.3604,  pop:'80K',  type:'town',    monitored:false },
  { name:'Muyuka',       region:'South-West', lat:4.2833,  lng:9.4167,  pop:'30K',  type:'town',    monitored:false },
  // North-West
  { name:'Bamenda',      region:'North-West', lat:5.9631,  lng:10.1591, pop:'410K', type:'city',    monitored:true  },
  { name:'Bafoussam',    region:'West',       lat:5.4766,  lng:10.4214, pop:'400K', type:'city',    monitored:true  },
  { name:'Kumbo',        region:'North-West', lat:6.2000,  lng:10.6833, pop:'70K',  type:'town',    monitored:false },
  // West
  { name:'Dschang',      region:'West',       lat:5.4500,  lng:10.0500, pop:'80K',  type:'city',    monitored:false },
  { name:'Mbouda',       region:'West',       lat:5.6333,  lng:10.2500, pop:'50K',  type:'town',    monitored:false },
  { name:'Foumban',      region:'West',       lat:5.7167,  lng:10.9167, pop:'90K',  type:'city',    monitored:false },
  // Adamawa
  { name:'Ngaoundéré',   region:'Adamawa',    lat:7.3294,  lng:13.5832, pop:'300K', type:'city',    monitored:false },
  { name:'Meiganga',     region:'Adamawa',    lat:6.5167,  lng:14.3000, pop:'60K',  type:'town',    monitored:false },
  // North
  { name:'Garoua',       region:'North',      lat:9.3017,  lng:13.3965, pop:'450K', type:'city',    monitored:false },
  { name:'Guider',       region:'North',      lat:9.9333,  lng:13.9500, pop:'50K',  type:'town',    monitored:false },
  // Far North
  { name:'Maroua',       region:'Far North',  lat:10.5900, lng:14.3159, pop:'380K', type:'city',    monitored:false },
  { name:'Kousséri',     region:'Far North',  lat:12.0833, lng:15.0333, pop:'100K', type:'city',    monitored:false },
  { name:'Mokolo',       region:'Far North',  lat:10.7333, lng:13.8000, pop:'50K',  type:'town',    monitored:false },
  // East
  { name:'Bertoua',      region:'East',       lat:4.5782,  lng:13.6830, pop:'200K', type:'city',    monitored:false },
  { name:'Batouri',      region:'East',       lat:4.4333,  lng:14.3667, pop:'60K',  type:'town',    monitored:false },
  // South
  { name:'Ebolowa',      region:'South',      lat:2.9000,  lng:11.1500, pop:'120K', type:'city',    monitored:false },
  { name:'Kribi',        region:'South',      lat:2.9389,  lng:9.9094,  pop:'100K', type:'city',    monitored:false },
  { name:'Sangmélima',   region:'South',      lat:2.9333,  lng:11.9833, pop:'50K',  type:'town',    monitored:false },
]

export const cameroonRegions = [
  'Adamawa','Centre','East','Far North','Littoral','North','North-West','South','South-West','West'
]

// Roads per monitored city
export const allRoads = [
  // Douala
  { id:'R001', name:'Autoroute Douala–Yaoundé',  city:'Douala',  region:'Littoral',   congestion:'high',     density:87, speed:28, lat:4.0511, lng:9.7679 },
  { id:'R002', name:'Boulevard de la Liberté',    city:'Douala',  region:'Littoral',   congestion:'medium',   density:62, speed:45, lat:4.0560, lng:9.7060 },
  { id:'R003', name:'Avenue Charles de Gaulle',   city:'Douala',  region:'Littoral',   congestion:'high',     density:91, speed:18, lat:4.0581, lng:9.7233 },
  { id:'R004', name:'Carrefour Ndokotti',          city:'Douala',  region:'Littoral',   congestion:'critical', density:98, speed:5,  lat:4.0488, lng:9.7315 },
  { id:'R005', name:'Rue Njo-Njo',                 city:'Douala',  region:'Littoral',   congestion:'medium',   density:55, speed:50, lat:4.0350, lng:9.7120 },
  // Yaoundé
  { id:'R006', name:'Boulevard du 20 Mai',         city:'Yaoundé', region:'Centre',     congestion:'medium',   density:58, speed:48, lat:3.8700, lng:11.5250 },
  { id:'R007', name:'Carrefour Mvog-Mbi',          city:'Yaoundé', region:'Centre',     congestion:'high',     density:80, speed:22, lat:3.8480, lng:11.5080 },
  { id:'R008', name:'Avenue Ahmadou Ahidjo',       city:'Yaoundé', region:'Centre',     congestion:'low',      density:25, speed:70, lat:3.8667, lng:11.5167 },
  { id:'R009', name:'Carrefour Obili',              city:'Yaoundé', region:'Centre',     congestion:'medium',   density:60, speed:42, lat:3.8550, lng:11.4950 },
  // Buea
  { id:'R010', name:'Molyko Main Road',            city:'Buea',    region:'South-West', congestion:'medium',   density:55, speed:40, lat:4.1557, lng:9.2432 },
  { id:'R011', name:'Buea–Mutengene Highway',      city:'Buea',    region:'South-West', congestion:'low',      density:30, speed:60, lat:4.1400, lng:9.2700 },
  { id:'R012', name:'Mile 17 Junction',            city:'Buea',    region:'South-West', congestion:'high',     density:78, speed:20, lat:4.1650, lng:9.2550 },
  { id:'R013', name:'Great Soppo Road',            city:'Buea',    region:'South-West', congestion:'low',      density:28, speed:55, lat:4.1700, lng:9.2400 },
  // Limbe
  { id:'R014', name:'Limbe–Douala Road',           city:'Limbe',   region:'South-West', congestion:'medium',   density:50, speed:45, lat:4.0165, lng:9.2057 },
  { id:'R015', name:'Church Street Limbe',         city:'Limbe',   region:'South-West', congestion:'low',      density:32, speed:58, lat:4.0200, lng:9.2000 },
  // Bamenda
  { id:'R016', name:'Commercial Avenue Bamenda',   city:'Bamenda', region:'North-West', congestion:'medium',   density:60, speed:38, lat:5.9631, lng:10.1591 },
  { id:'R017', name:'Up Station Road',             city:'Bamenda', region:'North-West', congestion:'low',      density:22, speed:65, lat:5.9700, lng:10.1500 },
  // Bafoussam
  { id:'R018', name:'Bafoussam–Yaoundé Road',      city:'Bafoussam',region:'West',      congestion:'medium',   density:48, speed:52, lat:5.4766, lng:10.4214 },
]
