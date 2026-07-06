import rss from '@astrojs/rss';

const posts = [
  { title: 'How to Decode Base64: Step-by-Step Guide', slug: 'how-to-decode-base64', description: 'Learn how to decode Base64 in JavaScript, Python, command line, and online. UTF-8 safe methods and common mistakes.', date: '2026-07-02', category: 'Base64 How-To' },
  { title: 'Can I Concatenate Base64 Strings?', slug: 'can-i-concatenate-base64-strings', description: 'Yes, but you need to strip the padding first. Here is how it works, why it breaks, and the right way to join Base64 strings.', date: '2026-07-02', category: 'Base64 How-To' },
  { title: 'Base64 to Hex: Complete Conversion Guide', slug: 'base64-to-hex', description: 'Convert Base64 to hexadecimal and back. JavaScript and Python examples. When to use hex vs Base64.', date: '2026-07-02', category: 'Encoding' },
  { title: 'Hex to Base64: How to Convert Between Formats', slug: 'hex-to-base64', description: 'Convert hex strings to Base64 in JavaScript, Python, and command line. Smaller output, ready for APIs.', date: '2026-07-02', category: 'Encoding' },
  { title: 'PowerShell Base64 Decode: Commands and Examples', slug: 'powershell-base64-decode', description: 'Decode Base64 in PowerShell using built-in .NET commands. UTF-8, Unicode, file decode. No modules needed.', date: '2026-07-02', category: 'Base64 How-To' },
  { title: 'PNG to Base64: How to Convert Images', slug: 'png-to-base64', description: 'Convert PNG images to Base64 for HTML, CSS, and JSON. Browser, JavaScript, and Python methods.', date: '2026-07-02', category: 'How-To' },
  { title: 'SVG to Base64: Embed Vector Graphics', slug: 'svg-to-base64', description: 'Convert SVG files to Base64 for CSS backgrounds, data URIs, and secure embedding. JavaScript and Python examples.', date: '2026-07-02', category: 'How-To' },
  { title: 'How to Encode a File to Base64', slug: 'how-to-encode-file-to-base64', description: 'Encode any file to Base64 right in your browser. Images, PDFs, JSON, text files. Drag, drop, done.', date: '2026-07-02', category: 'Base64 How-To' },
  { title: 'Base64 vs Base64URL: What\'s the Difference?', slug: 'base64-vs-base64url', description: 'The difference between standard Base64 and URL-safe Base64URL, when to use each, and how our tool handles both automatically.', date: '2026-07-02', category: 'Encoding Comparison' },
  { title: 'How to Convert Base64 to a Downloadable File', slug: 'online-base64-to-file', description: 'Turn any Base64 string back into a downloadable file. Browser, JavaScript, Python, and CLI methods with auto file-type detection.', date: '2026-07-06', category: 'Base64 How-To' },
  { title: 'What Is a Base64 Translator? How Encoding and Decoding Work', slug: 'base64-translator-guide', description: 'Learn how Base64 translation converts data between binary and text. Step-by-step encoding walkthrough with the Base64 alphabet table.', date: '2026-07-06', category: 'Encoding' },
  { title: 'How to Encode Text to Base64: The Complete Guide', slug: 'text-to-base64-encode', description: 'Convert any text string to Base64. Methods for JavaScript, Python, CLI, and online tools. UTF-8 safe, emoji support included.', date: '2026-07-06', category: 'Base64 How-To' },
  { title: 'Base64 Images Explained: Data URIs, Performance, and When to Use Them', slug: 'base64-picture-guide', description: 'How Base64 pictures and Data URIs work. Performance comparison, supported formats, and when embedding helps vs hurts.', date: '2026-07-06', category: 'How-To' },
  { title: 'Base64 Is Not Encryption: What People Get Wrong', slug: 'base64-is-not-encryption', description: 'Base64 is encoding, not encryption. Learn the critical difference, real security risks, and what to use for actual data protection.', date: '2026-07-06', category: 'Encoding' },
];

export async function GET(context) {
  return rss({
    title: 'Base64 Guides & Tutorials | base64go.com',
    description: 'Practical guides on Base64 encoding, decoding, and everything in between.',
    site: context.site || 'https://base64go.com',
    items: posts.map((post) => ({
      title: post.title,
      description: post.description,
      pubDate: new Date(post.date),
      link: `/blog/${post.slug}/`,
      categories: [post.category],
    })),
    customData: `<language>en-us</language>`,
  });
}
