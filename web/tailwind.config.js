export default {
  content: ['./index.html','./src/**/*.{js,jsx}'],
  theme: { extend: {
    colors: { navy: { 950:'#09263e',900:'#103b5c',800:'#18547d',700:'#286d96'},gold:{100:'#e8f7ff',200:'#cdeeff',400:'#79c9f2',500:'#38aee8',600:'#168fcf'},canvas:'#eaf7fd'},
    fontFamily:{sans:['Inter','ui-sans-serif','system-ui'],display:['Georgia','ui-serif','serif']},
    boxShadow:{soft:'0 6px 28px rgba(18,37,58,.055)'}
  }} ,plugins:[]
};
