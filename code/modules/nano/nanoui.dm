//# Nano UI Framework

/**
 * Used to open and update nano browser uis
 */
/datum/nanoui
	/// The user who opened this ui.
	var/mob/user
	/// The object this ui "belongs" to.
	var/datum/src_object
	/// The title of this ui.
	var/title as text
	/// The key of this ui, this is to allow multiple (different) uis for each {src_object}.
	var/ui_key as text
	/// Used as the window name/identifier for {browse} and {onclose}.
	var/window_id as text
	/// An extra ref to use when the window is closed, usually null.
	var/datum/ref
	/// whether to use extra logic when window closes.
	var/on_close_logic = TRUE
	/// the browser window width.
	VAR_PRIVATE/width = 0 as num
	/// the browser window height.
	VAR_PRIVATE/height = 0 as num
	/// Options for modifying window behaviour. Window option is set using {window_id}.
	VAR_PRIVATE/window_options = "focus=0;can_close=1;can_minimize=1;can_maximize=0;can_resize=1;titlebar=1;"
	/// The list of stylesheets to apply to this ui.
	VAR_PRIVATE/list/stylesheets = list()
	/// The list of javascript scripts to use for this ui.
	VAR_PRIVATE/list/scripts = list()
	/// A list of templates which can be used with this ui.
	VAR_PRIVATE/list/templates = list()
	/// The layout key for this ui (this is used on the frontend, leave it as "default" unless you know what you're doing).
	VAR_PRIVATE/layout_key = "default"
	/// Optional layout key for additional ui header content to include.
	VAR_PRIVATE/layout_header_key = "default_header"
	/// This sets whether to re-render the ui layout with each update (default 0, turning on will break the map ui if it's in use).
	VAR_PRIVATE/auto_update_layout = FALSE
	/// This sets whether to re-render the ui content with each update (default 1).
	VAR_PRIVATE/auto_update_content = TRUE
	/// The default state to use for this ui (this is used on the frontend, leave it as "default" unless you know what you're doing).
	VAR_PRIVATE/state_key = "default"
	/// Show the map ui, this is used by the default layout.
	VAR_PRIVATE/show_map = FALSE
	/// The map z level to display.
	VAR_PRIVATE/map_z_level = 1 as num
	/// Initial data, containing the full data structure, must be sent to the ui (the data structure cannot be extended later on).
	VAR_PRIVATE/list/initial_data = list()
	/// If true, update the ui automatically every {master_controller} tick.
	VAR_PRIVATE/is_auto_updating = FALSE
	/// The current status/visibility of the ui.
	VAR_PRIVATE/status = STATUS_INTERACTIVE

	/// Relationship between a master interface and its children. Used in update_status
	var/datum/nanoui/master_ui
	var/list/datum/nanoui/children = list()
	VAR_PRIVATE/datum/topic_state/state = null

/**
 * Create a new nanoui instance.
 * TODO: Make a initilize pattern instead.
 *
 * ---
 * ### @params
 * * nuser       : The mob who has opened/owns this ui.
 * * nsrc_object : The datum which this ui belongs to.
 * * nui_key     : A string key to use for this ui. Allows for multiple unique uis on one src_oject.
 * * ntemplate   : The filename of the template file from /nano/templates (e.g. "my_template.tmpl").
 * * ntitle      : The title of this ui.
 * * nwidth      : The width of the ui window.
 * * nheight     : The height of the ui window.
 * * nref        : A custom ref to use if "on_close_logic" is set to 1.
 * * master_ui   : The master ui for this ui (if it has one).
 * * state       : The state to use for this ui.
 *
 * ---
 * ### @returns
 * * src : The new nanoui object
 */
/datum/nanoui/New(mob/nuser, datum/nsrc_object, nui_key as text, ntemplate_filename as text, ntitle as text, nwidth as num, nheight as num, datum/nref, datum/nanoui/master_ui = null, datum/topic_state/state = global.default_topic_state)
	user = nuser
	src_object = nsrc_object
	ui_key = nui_key
	window_id = "[ui_key]\ref[src_object]"

	src.master_ui = master_ui
	if(master_ui)
		master_ui.children += src
	src.state = state

	// add the passed template filename as the "main" template, this is required
	add_template("main", ntemplate_filename)

	if (ntitle)
		title = sanitize(ntitle)
	if (nwidth)
		width = nwidth
	if (nheight)
		height = nheight
	if (nref)
		ref = nref

	add_common_assets()
	var/datum/asset/assets = get_asset_datum(/datum/asset/nanoui)
	assets.send(user, ntemplate_filename)

/// Do not qdel nanouis. Use close() instead.
/datum/nanoui/Destroy()
	user = null
	src_object = null
	state = null
	. = ..()

/**
 * Use this proc to add assets which are common to (and required by) all nano uis
 *
 * ---
 * ### @returns
 * * null
 */
/datum/nanoui/proc/add_common_assets()
	add_script("libraries.min.js")       // A JS file comprising of jQuery, doT.js and jQuery Timer libraries (compressed together).
	add_script("nano_utility.js")        // The NanoUtility JS, this is used to store utility functions.
	add_script("nano_template.js")       // The NanoTemplate JS, this is used to render templates.
	add_script("nano_state_manager.js")  // The NanoStateManager JS, it handles updates from the server and passes data to the current state.
	add_script("nano_state.js")          // The NanoState JS, this is the base state which all states must inherit from.
	add_script("nano_state_default.js" ) // The NanoStateDefault JS, this is the "default" state (used by all UIs by default), which inherits from NanoState.
	add_script("nano_base_callbacks.js") // The NanoBaseCallbacks JS, this is used to set up (before and after update) callbacks which are common to all UIs.
	add_script("nano_base_helpers.js")   // The NanoBaseHelpers JS, this is used to set up template helpers which are common to all UIs.
	add_stylesheet("shared.css")         // this CSS sheet is common to all UIs.
	add_stylesheet("tgui.css")           // this CSS sheet is common to all UIs.
	add_stylesheet("icons.css")          // this CSS sheet is common to all UIs.

/**
 * Set the current status (also known as visibility) of this ui.
 *
 * ---
 * ### @params
 * * state int The status to set, see the defines at the top of this file
 * * push_update int (bool) Push an update to the ui to update it's status (an update is always sent if the status has changed to red (0))
 *
 * ---
 * ### @returns
 * * null
 */
/datum/nanoui/proc/set_status(state as num|null, push_update = FALSE)
	if (state != status) // Only update if it is different
		if (status == STATUS_DISABLED)
			status = state
			if (push_update)
				update()
		else
			status = state
			if (push_update || status == STATUS_DISABLED)
				// Update the UI, force the update in case the status is 0, data is null so that previous data is used
				push_data(null, TRUE)

/**
 * Update the status (visibility) of this ui based on the user's status
 *
 * ---
 * ### @params
 * * push_update : Push an update to the ui to update it's status. This is set to 0/false if an update is going to be pushed anyway (to avoid unnessary updates)
 *
 * ---
 * ### @returns
 * * TRUE if the ui is closed, FALSE if it is open or ignored.
 */
/datum/nanoui/proc/update_status(push_update = FALSE)
	var/atom/host = src_object && src_object.nano_host()
	if(!host)
		close()
		return TRUE
	var/new_status = host.CanUseTopic(user, state)
	if(master_ui)
		new_status = min(new_status, master_ui.status)

	if(new_status == STATUS_CLOSE)
		close()
		return TRUE
	set_status(new_status, push_update)

	return FALSE


/**
 * Get config data to sent to the ui.
 *
 * ---
 * ### @returns
 * * A list containing the config data.
 */
/datum/nanoui/proc/get_config_data()
	var/name = sanitize("[src_object]")
	var/decl/currency/cur = GET_DECL(global.using_map.default_currency)
	var/list/config_data = list(
		"title"             = title,
		"srcObject"         = list("name" = name),
		"stateKey"          = state_key,
		"status"            = status,
		"autoUpdateLayout"  = auto_update_layout,
		"autoUpdateContent" = auto_update_content,
		"showMap"           = show_map,
		"mapName"           = global.using_map.path,
		"mapZLevel"         = map_z_level,
		"mapZLevels"        = SSmapping.map_levels,
		"user"              = list("name" = user.name),
		"currency"          = cur.name,
		"templateFileName"  = global.template_file_name,
	)
	return config_data


/**
 * Return the HTML for this UI
 * TODO: Web components :>
 *
 * ---
 * ### @returns
 * * A HTML string for the UI.
 */
/datum/nanoui/proc/get_html()

	// before the UI opens, add the layout files based on the layout key
	add_stylesheet("layout_[layout_key].css")
	add_template("layout", "layout_[layout_key].tmpl")
	if (layout_header_key)
		add_template("layoutHeader", "layout_[layout_header_key].tmpl")

	var/head_content = ""

	for (var/filename in scripts)
		head_content += "<script type='text/javascript' src='[filename]'></script>\n"

	for (var/filename in stylesheets)
		head_content += "<link rel='stylesheet' type='text/css' href='[filename]'>\n"

	var/template_data_json = "{}" // An empty JSON object
	if (templates.len > 0)
		template_data_json = strip_improper(json_encode(templates))

	var/list/send_data = get_send_data(initial_data)
	var/initial_data_json = replacetext(replacetext(json_encode(send_data), "&#34;", "&amp;#34;"), "'", "&#39;")
	initial_data_json = strip_improper(initial_data_json);

	var/url_parameters_json = json_encode(list("src" = "\ref[src]"))

	// #define HTML_SCRIPT_JSON(id, json) {"<script type='application/json' id='[id]'>[json]</script>"}

	#define HTML_DOCUMENT(HEAD, BODY) {"<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta http-equiv="X-UA-Compatible" content="IE=edge">[HEAD]</head><body>[BODY]</body></html>"}

	return {"
<!DOCTYPE html>
<html>

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">

	<script type='application/json' id='nanoui:templateData'>[template_data_json]</script>
	<script type='application/json' id='nanoui:urlParameters'>[url_parameters_json]</script>
	<script type='application/json' id='nanoui:initialData'>[initial_data_json]</script>

	<script type='text/javascript'>
		function receiveUpdateData(jsonString) {
			// We need both jQuery and NanoStateManager to be able to recieve data
			// At the moment any data received before those libraries are loaded will be lost
			if (typeof NanoStateManager != 'undefined' && typeof jQuery != 'undefined') {
				NanoStateManager.receiveUpdateData(jsonString);
			}
		}
	</script>
	[head_content]
</head>

<body scroll=auto>
	<div id='uiLayout'></div>
	<noscript>
		<div id='uiNoScript'>
			<h2>JAVASCRIPT REQUIRED</h2>
			<p>Your Internet Explorer's Javascript is disabled (or broken).<br/>
			Enable Javascript and then open this UI again.</p>
		</div>
	</noscript>
</body>

</html>
"}

	// return HTML_DOCUMENT(
	// 	{"
	// 		<script type='application/json' id='nanoui:templateData'>[template_data_json]</script>
	// 		<script type='application/json' id='nanoui:urlParameters'>[url_parameters_json]</script>
	// 		<script type='application/json' id='nanoui:initialData'>[initial_data_json]</script>

	// 		<script type='text/javascript'>
	// 			function receiveUpdateData(jsonString) {
	// 				// We need both jQuery and NanoStateManager to be able to recieve data
	// 				// At the moment any data received before those libraries are loaded will be lost
	// 				if (typeof NanoStateManager != 'undefined' && typeof jQuery != 'undefined') {
	// 					NanoStateManager.receiveUpdateData(jsonString);
	// 				}
	// 			}
	// 		</script>
	// 	"},
	// 	{"
	// 		<div id='uiLayout'></div>
	// 		<noscript>
	// 			<div id='uiNoScript'>
	// 				<h2>JAVASCRIPT REQUIRED</h2>
	// 				<p>Your Internet Explorer's Javascript is disabled (or broken).<br/>
	// 				Enable Javascript and then open this UI again.</p>
	// 			</div>
	// 		</noscript>
	// 	"}
	// )


/**
 * Open this UI
 *
 * @return nothing
 */
/datum/nanoui/proc/open()
	if(!user.client)
		return

	if(!src_object)
		close()

	var/window_size = ""
	if (width && height)
		window_size = "size=[width]x[height];"
	if(update_status(0))
		return // Will be closed by update_status().

	show_browser(user, get_html(), "window=[window_id];[window_size][window_options]")
	winset(user, "mapwindow.map", "focus=true") // return keyboard focus to map
	on_close_winset()
	//onclose(user, window_id)
	SSnano.ui_opened(src)

/**
 * Reinitialise this UI, potentially with a different template and/or initial data
 *
 * @return nothing
 */
/datum/nanoui/proc/reinitialise(template, new_initial_data)
	if(template)
		add_template("main", template)
	if(new_initial_data)
		set_initial_data(new_initial_data)
	open()

/**
 * Close this UI
 *
 * @return nothing
 */
/datum/nanoui/proc/close()
	is_auto_updating = FALSE
	SSnano.ui_closed(src)
	show_browser(user, null, "window=[window_id]")
	for(var/datum/nanoui/child in children)
		child.close()
	children.Cut()
	state = null
	master_ui = null
	qdel(src)

/**
 * Set the UI window to call the nanoclose verb when the window is closed
 * This allows Nano to handle closed windows
 *
 * @return nothing
 */
/datum/nanoui/proc/on_close_winset()
	if(!user.client)
		return
	var/params = "\ref[src]"

	spawn(2)
		if(!user || !user.client)
			return
		winset(user, window_id, "on-close=\"nanoclose [params]\"")

/**
 * Push data to an already open UI window
 *
 * @return nothing
 */
/datum/nanoui/proc/push_data(data, force_push = 0)
	if(update_status(0))
		return // Closed
	if (status == STATUS_DISABLED && !force_push)
		return // Cannot update UI, no visibility
	to_output(user, list2params(list(strip_improper(json_encode(get_send_data(data))))),"[window_id].browser:receiveUpdateData")

/**
 * This Topic() proc is called whenever a user clicks on a link within a Nano UI
 * If the UI status is currently STATUS_INTERACTIVE then call the src_object Topic()
 * If the src_object Topic() returns 1 (true) then update all UIs attached to src_object
 *
 * @return nothing
 */
/datum/nanoui/Topic(href, href_list)
	update_status(0) // update the status
	if (status != STATUS_INTERACTIVE || user != usr) // If UI is not interactive or usr calling Topic is not the UI user
		return

	// This is used to toggle the nano map ui
	var/map_update = 0
	if(href_list["showMap"])
		set_show_map(text2num(href_list["showMap"]))
		map_update = 1

	if(href_list["mapZLevel"])
		var/map_z = text2num(href_list["mapZLevel"])
		if(isMapLevel(map_z))
			set_map_z_level(map_z)
			map_update = 1

	if ((src_object && src_object.Topic(href, href_list, state)) || map_update)
		SSnano.update_uis(src_object) // update all UIs attached to src_object

/**
 * Process this UI, updating the entire UI or just the status (aka visibility)
 *
 * @param update string For this UI to update
 *
 * @return nothing
 */
/datum/nanoui/proc/try_update(update = 0)
	if (!src_object || !user)
		close()
		return

	if (status && (update || is_auto_updating))
		update() // Update the UI (update_status() is called whenever a UI is updated)
	else
		update_status(1) // Not updating UI, so lets check here if status has changed

/**
 * This Process proc is called by SSnano.
 * Use try_update() to make manual updates.
 */
/datum/nanoui/Process()
	try_update(0)

/**
 * Update the UI
 *
 * @return nothing
 */
/datum/nanoui/proc/update(var/force_open = 0)
	src_object.ui_interact(user, ui_key, src, force_open, master_ui, state)
