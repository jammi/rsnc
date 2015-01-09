HHT_PREFS =
  calendarColors: 
    exercise: '#5FABF1'
    my: '#5FABF1'
    team: '#F39C12'
    shared: '#27AE60'
  tableColors: 
    my: '#5FABF1'
    team: '#F39C12'
    shared: '#27AE60'
  folderColors: 
    my: '#5FABF1'
    team: '#F39C12'
    shared: '#27AE60'
  contactColors:
    my: '#5FABF1'
    team: '#F39C12'
    club: '#F39C12'
    league: '#F39C12'
  eventColors:
    exercise: '#38ACD4'
    my: '#38ACD4'
    team: '#F39C12'
    shared: '#27AE60'
  buttonTypes:
    exercise: 'blue'
    my: 'blue'
    team: 'orange'
    shared: 'green'

HHT_COLORS =
  palette: [
    '#3F4769' #Blue 1  #0
    '#697797' #Blue 2  #1
    '#8A98B8' #Blue 3  #2
    '#ABB6CD' #Blue 4  #3
    '#F2F4FA' #White   #4
    '#5FABF1' #Blue 5  #5
    '#09D1C4' #Green 1 #6
    '#CE5E73' #Red 1   #7 
    '#C3A7F3' #Pink    #8
    '#E5788C' #Red 2   #9
    '#31AF70' #Green2  #10
    '#8E44AD' #Pink2   #11
    '#9B7CD2' #Pink 3  #12
    '#8B572A' #Brown  #13
    '#7ED321' #Green 3 #14
    '#F5A623' #Orange  #15
    '#4C4C4C' #Light Black #16
    '#B8E986' #Light Light Green #17
  ]

  get:( i ) ->
    i = parseInt( i )
    @palette[ i % @palette.length ]
