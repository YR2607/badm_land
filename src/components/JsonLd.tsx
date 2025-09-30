import React from 'react';

interface JsonLdProps<T = unknown> {
  data: T;
}

// Lightweight component that injects JSON-LD structured data
const JsonLd = <T,>({ data }: JsonLdProps<T>) => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
);

export default JsonLd;
