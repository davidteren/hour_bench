module ApplicationHelper
  def lucide_icon(name, options = {})
    size = options[:size] || 20
    css_class = options[:class] || ""

    content_tag :i, "",
      "data-lucide": name,
      class: "lucide-icon #{css_class}",
      style: "width: #{size}px; height: #{size}px; stroke-width: 1.5;"
  end

  def stat_icon_name(stat_key)
    case stat_key.to_s
    when /hours/ then "clock"
    when /revenue/ then "dollar-sign"
    when /projects/ then "clipboard-list"
    when /users/ then "users"
    else "bar-chart-3"
    end
  end

  def format_stat_value(key, value)
    case key.to_s
    when /revenue/ then "$#{number_with_delimiter(value.round(2))}"
    when /hours/ then "#{number_with_delimiter(value.round(1))}h"
    else number_with_delimiter(value)
    end
  end
end
