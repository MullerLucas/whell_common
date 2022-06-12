import {HellElement} from "../../../whell/hell_element.js";
import {HellImporter, HellPaths} from "../../../whell/hell_importer.js";



const IMPORT_NON_BLOCKING = HellImporter.start_loading_resources([
    { path: HellPaths.CSS_FA }
]);

const IMPORT_BLOCKING = await HellImporter.load_resources(
    HellPaths.CSS_DEFAULTS,
    [
        HellImporter.html_def_from_path(import.meta.url),
        HellImporter.css_def_from_path(import.meta.url),
    ]
);



export class FooterSimple extends HellElement {
    protected override on_connected() {
        super.on_connected();

        HellImporter.add_all_imports_to_node(this.sroot, IMPORT_BLOCKING);
        HellImporter.add_all_imports_to_node_when_loaded(this.sroot, IMPORT_NON_BLOCKING);
    }
}
