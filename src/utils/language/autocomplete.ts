import {autocompletion, completeFromList} from "@codemirror/autocomplete";


export function km_autocomplete() {
  return autocompletion({
    override: [
		completeFromList([
			{
				label: 'km.heading', 
				type: 'function', 
				apply: 'km.heading()', 
				boost: 2, 
				detail: '(text?: string, options?: HeadingOptions) => void'
			},
			{
				label: 'km.classification', 
				type: 'function', 
				apply: 'km.classification()', 
				boost: 2, 
				detail: '(options?: ClassificationOptions) => void'
			},
			{
				label: 'km.backlinks', 
				type: 'function', 
				apply: 'km.backlinks()', 
				boost: 2, 
				detail: '(options?: BacklinkOptions) => void'
			},
			{
				label: 'km.page', 
				type: 'function', 
				apply: 'km.page()', 
				boost: 2, 
				detail: '(ref: path | string) => PageDefinition'
			},
			{
				label: 'dv',
				type: 'class',
				apply: 'dv',
				boost: 5,
				detail: '{ page: (path) => File; pages: (query) => File[] }'
			}
		])
    ]
  });
}
