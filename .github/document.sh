export FL_TITLE="Functional"
export FL_DESCRIPTION="Common Functional Programming Algebraic data types for JavaScript that is compatible with most \
modern browsers and Deno."
export FL_GITHUB_URL="https://github.com/sebastienfilion/functional"
export FL_DENO_URL="https://deno.land/x/functional"
export FL_VERSION="v1.3.2"

deno run --allow-all --unstable ../@functional:generate-documentation/cli.js document \
"$FL_TITLE" \
"$FL_DESCRIPTION" \
$FL_GITHUB_URL \
$FL_DENO_URL \
$FL_VERSION \
./.github/readme-fragment-usage.md \
./library/*.js \
./.github/readme-fragment-typescript.md \
./.github/readme-fragment-license.md
