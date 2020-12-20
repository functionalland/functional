export FL_TITLE="Functional"
export FL_DESCRIPTION="Common Functional Programming Algebraic data types for JavaScript that is compatible with most modern browsers and Deno."
export FL_VERSION="v1.3.0"

deno run --allow-all --unstable ../@functional:generate-documentation/cli.js document "$FL_TITLE" "$FL_DESCRIPTION" $FL_VERSION ./.github/readme-fragment-usage.md ./library/*.js ./.github/readme-fragment-typescript.md ./.github/readme-fragment-license.md
