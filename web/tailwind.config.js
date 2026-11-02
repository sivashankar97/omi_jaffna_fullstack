export default {
  content: ['./index.html','./src/**/*.{js,jsx}'],
  theme: { extend: {
    colors: {
      // Ink + sidebar. OMI navy.
      navy: { 950:'#0a1e30',900:'#103b5c',800:'#18547d',700:'#286d96'},
      // Interactive colour (links, icons, focus). Public-site brand teal; the `gold` name is kept so existing classes keep working.
      gold:{100:'#e7f7f9',200:'#c5ebf0',400:'#2fbfd0',500:'#17b3c6',600:'#0a7d8c'},
      // OMI gold accent: active navigation, highlights.
      accent:{100:'#fff5d6',200:'#ffe8a3',400:'#ffcf4a',500:'#f5b301',600:'#a87a00'},
      canvas:'#f4f6f9',
      line:'#e3e8ee'
    },
    fontFamily:{sans:['Inter','ui-sans-serif','system-ui'],display:['Georgia','ui-serif','serif']},
    boxShadow:{
      soft:'0 1px 2px rgba(16,24,40,.04),0 1px 3px rgba(16,24,40,.06)',
      pop:'0 12px 32px -8px rgba(16,24,40,.18),0 4px 8px -4px rgba(16,24,40,.08)'
    }
  }} ,plugins:[]
};
