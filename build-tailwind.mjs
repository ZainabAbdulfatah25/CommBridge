// build-tailwind.mjs
import fs from 'fs';
import postcss from 'postcss';
import tailwind from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

// Path to your input CSS file with Tailwind directives
const inputFile = 'input.css';  
const outputFile = 'output.css';

try {
  const cssInput = fs.readFileSync(inputFile, 'utf-8');

  postcss([tailwind, autoprefixer])
    .process(cssInput, { from: inputFile, to: outputFile })
    .then(result => {
      fs.writeFileSync(outputFile, result.css);
      if (result.map) fs.writeFileSync(`${outputFile}.map`, result.map.toString());
      console.log(`✅ Tailwind build complete! Output written to ${outputFile}`);
    })
    .catch(err => {
      console.error('❌ Error during Tailwind build:', err);
    });

} catch (err) {
  console.error('❌ Error reading input CSS file:', err);
}

