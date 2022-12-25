module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        md: '900px',
      },
      borderRadius: {
        DEFAULT : '25px',
        md : '20px',
        lg : '25px',
        sm: '15px'
      },
      
      colors: {
        red: {
          DEFAULT: "#FF2359"
        },
        purple: {
          DEFAULT: "#FF00F3"
        },
        verify : "#2ecc71",
        yellow: {
            DEFAULT: "#FFFF0D",
        },
        gray: {
            DEFAULT: "#C4C4C4",
            1: "#171717",
            2: "#2F2F2F",
            3: "#0F0F0F",
            4: "#161616",
            5: "#6F6F6F",
            6: "#898989",
            7: "#272727",
            8: "#111111",
            9: "#969696",
            border : "#414141",
        },
        blue: {
            DEFAULT: "#06C1FF",
            tweet : "#06C1FF",
            tweetDark : "#07AAE0",
            1 : "#4672FF",
            border : "#05AEE5",
        },
        darkbg : {
          DEFAULT : '#2E2E2E',
        },
        gradient : {
          lightblue : "#06C1FF",
          darkblue : "#4672FF",
          purple : "#FF00F3",
          red : "#FF2359"
        }
      },
      scale: {
        '105' : '1.015'
      },

      fontFamily: {
        sans: ['SF Pro Display'],
        serif : ['Titan One', 'Pilat Extended'],
        mono: ['system-ui']
      },

      fontSize: {
        'tiny' : '0.7rem',
      }

    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
