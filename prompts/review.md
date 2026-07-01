---
spec: ""
design: ""
is_spec_review: "{{ truthy(spec || design) }}"

---

spec review: {{is_spec_review}}
