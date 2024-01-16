/decl/sprite_accessory_category
	abstract_type = /decl/sprite_accessory_category
	/// A name to display in preferences.
	var/name
	/// A default always-available type used as a fallback.
	var/default_accessory
	/// A default colour for the above.
	var/default_accessory_color = COLOR_BLACK
	/// A base abstract accessory type for this category.
	var/base_accessory_type
	/// Set to FALSE for categories where multiple selection is allowed (markings)
	var/single_selection = TRUE
	/// A maximum number of selections. Ignored if null.
	var/max_selections
	/// Set to TRUE to apply these markings as defaults when bodytype is set.
	var/always_apply_defaults = FALSE

/decl/sprite_accessory_category/validate()
	. = ..()
	if(!name)
		. += "no name set"
	if(!ispath(base_accessory_type, /decl/sprite_accessory_category))
		. += "invalid base accessory type: [base_accessory_type || "null"]"
	if(single_selection && !default_accessory)
		. += "single selection set but no default accessory set"
