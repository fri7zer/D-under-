const ARTIST_MEDIA={
enzalevrai:{image:'assets/artists/enzalevrai-square.png',focal:'44% 34%',focalMobile:'46% 30%',description:'« Abats 5 », MUSIC TRIP et une série de collaborations avec la nouvelle scène.'},
okiz:{image:'assets/artists/okiz.jpg',focal:'50% 28%',focalMobile:'50% 22%',description:'Rap, R&B, afro et trap — « The day (Live) », « Nya » et « GMV » en 2026.'},
erton:{image:'assets/artists/erton-square.png',focal:'50% 52%',focalMobile:'50% 44%',description:'Après « M.Œ », Erton poursuit ses connexions avec Okiz, $kona et ENZALEVRAI.'},
kona:{description:'Aux côtés d’Erton sur « cyb », sorti en décembre 2025.'},
'bendo-lm':{description:'De l’EP « Érotomanie » au morceau collectif « FREE CAMEROON ».'},
kidda:{description:'Profil officiel en cours de vérification.'},
dustry:{image:'assets/artists/dustry-square.png',focal:'50% 48%',focalMobile:'52% 42%',description:'« XIX: Dustry Era », avec Kalabinda, AR8, Khafardo et Jck_dws.'},
fcablack:{description:'Sur « MARIE JEANNE » avec Skidi et Okiz.'},
mods:{image:'assets/artists/mods-square.png',focal:'50% 36%',focalMobile:'50% 30%',description:'L’univers MUSIC TRIP, avec ENZALEVRAI, Erton et Lexy Clicks.'},
skidi:{description:'Sur « MARIE JEANNE » et « Burn Down ».'},
kemi:{description:'Profil officiel en cours de vérification.'},
ar8:{description:'Avec ENZALEVRAI sur « LA VIE QU’ON MÈNE » et Dustry sur « Soucis ».'},
'pef-jones':{description:'Présent sur « LOBBY » et plusieurs titres d’« EPIC Y.L.F.M ».'}
,'mic-monsta':{image:'assets/artists/mic-monsta-spotify.jpg',focal:'50% 36%',focalMobile:'50% 31%',description:'Portrait vérifié depuis le profil Spotify officiel. Fondateur de Kwata Music et voix majeure du rap camerounais.'}
,tenor:{image:'assets/artists/tenor-spotify.jpg',focal:'50% 34%',focalMobile:'50% 30%',description:'Portrait vérifié depuis le profil Spotify officiel. Une figure établie du rap camerounais francophone.'}
,jovi:{image:'https://muzikolmusicawards.com/images/aboutArtists/profiles/jovi.jpeg',focal:'50% 28%',focalMobile:'50% 24%',description:'Figure majeure du Mboko rap camerounais, également connu sous le nom Le Monstre.'}
,'stanley-enow':{image:'https://is1-ssl.mzstatic.com/image/thumb/AMCArtistImages116/v4/eb/d3/36/ebd336f8-576d-c758-b095-14339019620a/a8c41b42-4af7-4477-b657-e6830bc763e7_ami-identity-aa8f5d5a4deb00f54a7dd4ae39a8308b-2023-04-10T15-25-45.446Z_cropped.png/1688x1688bb.jpg',focal:'50% 30%',focalMobile:'50% 26%',description:'Portrait officiel associé au profil musical de Stanley Enow.'}
,minks:{image:'https://www.musicinafrica.net/sites/default/files/styles/profile_images_large/public/images/artist_profile/201802/minks.jpg?itok=zpkRjJc6',focal:'50% 30%',focalMobile:'50% 26%',description:'Portrait éditorial vérifié de Mink’s, figure de la scène rap camerounaise.'}
,'ko-c':{image:'https://mimimefoinfos.com/wp-content/uploads/2023/10/65207239_2340886559492210_8273264260969136128_n.jpg',focal:'50% 30%',focalMobile:'50% 26%',description:'Portrait éditorial vérifié de KO-C.'}
,maahlox:{image:'https://i.scdn.co/image/ab6761610000e5eb1998e161b7ebfd4929132df2',focal:'50% 28%',focalMobile:'50% 24%',description:'Portrait issu du profil Spotify de Maahlox Le Vibeur.'}
,'beri-boys-club':{image:'https://i.scdn.co/image/ab6761610000e5ebcc04872514b5e6f7919c4939',focal:'50% 42%',focalMobile:'50% 38%',description:'Collectif de Bonabéri formé par Orock, Djibril’zer, Hookah et Tasse.'}
,babal:{image:'assets/artists/babal-spotify.jpg',focal:'50% 46%',focalMobile:'50% 42%',description:'Portrait vérifié depuis le profil Spotify officiel. « B.A.B.A.L.png », « TROBU.png » et « CTRL + Z.ppt ».'}
};
const RELEASE_COVERS={
'okiz|The day (Live)':'assets/covers/okiz-the-day-live.jpg','enzalevrai|Abats 5':'assets/covers/enzalevrai-abats-5.jpg','erton|cyb (feat. $kona)':'assets/covers/erton-cyb.jpg','bendo-lm|FREE CAMEROON':'assets/covers/free-cameroon.jpg','fcablack|MARIE JEANNE':'assets/covers/marie-jeanne.jpg','skidi|MARIE JEANNE':'assets/covers/marie-jeanne.jpg'};
ARTISTS.forEach(a=>{const m=ARTIST_MEDIA[a.id]||{};if(m.image)a.image=m.image;a.focal=m.focal||'50% 38%';a.focalMobile=m.focalMobile||a.focal;a.description=m.description||'';a.releases.forEach(r=>r.cover=RELEASE_COVERS[`${a.id}|${r.title}`]||'')});
TRACKS.forEach(t=>{const a=ARTISTS.find(x=>x.id===t.artistId),r=a?.releases.find(x=>x.title===t.release);t.cover=r?.cover||''});
const FEATURED_RELEASES=[
{artist:'Okiz',artistId:'okiz',title:'The day (Live)',type:'Single live',date:'14 février 2026',cover:'assets/covers/okiz-the-day-live.jpg',links:{apple:'https://music.apple.com/us/album/the-day-live-single/1876439999'}},
{artist:'Erton',artistId:'erton',title:'cyb (feat. $kona)',type:'Single',date:'22 décembre 2025',cover:'assets/covers/erton-cyb.jpg',links:{}},
{artist:'ENZALEVRAI',artistId:'enzalevrai',title:'Abats 5',type:'Album',date:'8 juin 2026',cover:'assets/covers/enzalevrai-abats-5.jpg',links:{}},
{artist:'Bendo LM',artistId:'bendo-lm',title:'FREE CAMEROON',type:'Single collectif',date:'30 octobre 2025',cover:'assets/covers/free-cameroon.jpg',links:{apple:'https://music.apple.com/us/album/free-cameroon-feat-jck-kalabinda-enzalevrai-lexy-clicks/1850316741'}},
{artist:'FCABlack × Skidi × Okiz',artistId:'fcablack',title:'MARIE JEANNE',type:'Single',date:'14 février 2025',cover:'assets/covers/marie-jeanne.jpg',links:{}}];
