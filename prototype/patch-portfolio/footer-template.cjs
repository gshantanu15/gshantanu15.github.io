const icon = {
  mail: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3.5 5.5h17v13h-17zM4 6l8 6 8-6"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3.5" y="3.5" width="17" height="17" rx="1"/><text x="6" y="16.5">in</text></svg>',
  github: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M8.2 19.2c-3.2 1-3.7-1.4-3.7-1.4-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.1-3.1-.1-.3-.5-1.5.1-3.1 0 0 .9-.3 3.2 1.2a11.2 11.2 0 0 1 5.8 0c2.2-1.5 3.1-1.2 3.1-1.2.6 1.6.2 2.8.1 3.1.7.8 1.1 1.8 1.1 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.7 1.1.7 2.1v3.1"/></svg>'
};

function asciiWave(width = 270, height = 32) {
  const ramp = ' .:-=+*#';
  return Array.from({ length: height }, (_, row) => Array.from({ length: width }, (_, col) => {
    const u=col/(width-1),v=row/(height-1);
    const density=.08+.48*u+.26*v+.18*(.5+.5*Math.sin(u*Math.PI*2+v*3));
    return ramp[Math.min(ramp.length - 1, Math.floor(density * 7))];
  }).join('').trimEnd()).join('\n');
}

const contactLinks = `<div class="contact-links icon-links" aria-label="Contact links">
  <a class="icon-link" href="mailto:g.shantanu15@gmail.com"><span class="icon-surface">${icon.mail}</span><span>Email</span></a>
  <a class="icon-link" href="https://www.linkedin.com/in/shantanu-s-garg/" target="_blank" rel="noopener noreferrer"><span class="icon-surface">${icon.linkedin}</span><span>LinkedIn</span></a>
  <a class="icon-link" href="https://github.com/gshantanu15" target="_blank" rel="noopener noreferrer"><span class="icon-surface">${icon.github}</span><span>GitHub</span></a>
</div>`;

function footer(page = 'work') {
  return `<footer class="site-footer ascii-footer"><div class="shell footer-inner"><div class="footer-identity"><a class="brand" href="index.html">Shantanu Garg</a><p>Graduate Professional from Tampere University</p></div>${contactLinks}</div><div class="ascii-field" aria-hidden="true"><pre>${asciiWave()}</pre></div></footer>`;
}

module.exports = { footer, contactLinks };
