module NavigationHelper
  def nav_link(text, path, icon_name, options = {})
    active = current_page?(path) || request.path.start_with?(path)
    css_class = "nav-link #{'nav-link-active' if active}"

    link_to path, class: css_class do
      content_tag :span, class: "nav-link-content" do
        concat lucide_icon(icon_name, size: 18, class: "nav-link-icon")
        concat content_tag(:span, text, class: "nav-link-text")
      end
    end
  end
end
