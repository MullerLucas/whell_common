import {HellElement} from "../../../whell/hell_element.js";
import {RouterMain, PAGES} from "../../../../components/router_main/router_main.js";
import {STORE} from "../../../../components/base/base_data.js";
import {HelLHtml} from "../../../whell/hell_html.js";
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



export class HeaderSimple extends HellElement {
    private is_expanded = false;



    protected override on_connected() {
        super.on_connected();

        STORE.subscribe(this.update_view.bind(this));

        HellImporter.add_all_imports_to_node(this.sroot, IMPORT_BLOCKING);
        HellImporter.add_all_imports_to_node_when_loaded(this.sroot, IMPORT_NON_BLOCKING);

        HelLHtml.query(this.sroot, "button.mobile_nav_toggle")
            .addEventListener("click", this.open_mobile_nav.bind(this));

        HelLHtml.query(this.sroot, "#btn_logo")
            .addEventListener("click", this._handle_logo_btn_clicked.bind(this));

        this.update_view();
    }

    protected override on_disconnected(): void {
        super.on_disconnected();

        HelLHtml.query(this.sroot, "button.mobile_nav_toggle")
            .removeEventListener("click", this.open_mobile_nav.bind(this));

        HelLHtml.query(this.sroot, "#btn_logo")
            .removeEventListener("click", this._handle_logo_btn_clicked.bind(this));
    }

    protected override update_view(): void {
        const state = STORE.get_state();


        // toggle visibility
        // -----------------
        const prime_nav = this.query_sroot(".primary_navigation");
        prime_nav.setAttribute("data-visible", `${this.is_expanded}`)


        HelLHtml.query_all(prime_nav, "li").forEach(e => e.remove());
        const nav_template = HelLHtml.query<HTMLTemplateElement>(prime_nav, "template");

        // highlight selected li
        // ---------------------
        Object.entries(PAGES).forEach((value, index) => {
            const curr_page = value[1];

            const nav_clone = nav_template.content.cloneNode(true) as Element;
            const nav_li_clone = HelLHtml.query(nav_clone, "li");
            if (state.curr_page.path === curr_page.path) {
                nav_li_clone.classList.add("selected");
            }


            HelLHtml.query(nav_clone, "span[aria-hidden]")
                .textContent = `0${index}`;
            HelLHtml.query(nav_clone, "span:not([aria-hidden])")
                .textContent = curr_page.title;

            HelLHtml.query(nav_clone, "button")
                .addEventListener("click", () => RouterMain.route_to_page(curr_page));

            prime_nav.appendChild(nav_clone);
        });


        // burger-menu icon
        // ----------------
        const burger_menu = this.query_sroot(".mobile_nav_toggle i.fa-solid");
        if (this.is_expanded) {
            burger_menu.classList.remove("fa-bars");
            burger_menu.classList.add("fa-xmark");
        } else {
            burger_menu.classList.remove("fa-xmark");
            burger_menu.classList.add("fa-bars");
        }
    }



    open_mobile_nav(): void {
        this.is_expanded = !this.is_expanded;
        this.update_view();
    }

    private _handle_logo_btn_clicked() {
        console.info("HeaderFixed - _handle_logo_btn_clicked");
        RouterMain.route_to_page(PAGES.home);
    }
}
