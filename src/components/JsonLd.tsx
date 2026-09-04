interface JsonLdProps<T = unknown> {
  data: T;
}

// Lightweight component that injects JSON-LD structured data
const JsonLd = <T,>({ data }: JsonLdProps<T>) => {
  // Escape "<" so serialized data can never break out of the script tag (XSS)
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
};

export default JsonLd;
