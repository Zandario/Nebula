//# A bunch of Nano helpers.


/**
 * Set the ui to auto update (every master_controller tick).
 *
 * ---
 * ### @params
 * * nstate : Set auto update.
 *
 * ---
 * ### @returns
 * * null
 */
/datum/nanoui/proc/set_auto_update(nstate = TRUE)
	is_auto_updating = nstate


/**
 * Set the initial data for the ui. This is vital as the data structure set here cannot be changed when pushing new updates.
 *
 * ---
 * ### @params
 * * data : The list of data for this ui.
 *
 * ---
 * ### @returns
 * * null
 */
/datum/nanoui/proc/set_initial_data(list/data)
	initial_data = data


/**
 * Get data to sent to the ui.
 *
 * @param data /list The list of general data for this ui (can be null to use previous data sent)
 *
 * @return /list data to send to the ui
 */
/datum/nanoui/proc/get_send_data(var/list/data)
	var/list/config_data = get_config_data()

	var/list/send_data = list("config" = config_data)

	if (!isnull(data))
		send_data["data"] = data

	return send_data


/**
 * Set the browser window options for this ui
 *
 * @param nwindow_options string The new window options
 *
 * @return nothing
 */
/datum/nanoui/proc/set_window_options(nwindow_options)
	window_options = nwindow_options


/**
 * Set the layout key for use in the frontend Javascript
 * The layout key is the basic layout key for the page
 * Two files are loaded on the client based on the layout key varable:
 *     -> a template in /nano/templates with the filename "layout_<layout_key>.tmpl
 *     -> a CSS stylesheet in /nano/css with the filename "layout_<layout_key>.css
 *
 * @param nlayout string The layout key to use
 *
 * @return nothing
 */
/datum/nanoui/proc/set_layout_key(nlayout_key)
	layout_key = lowertext(nlayout_key)


/**
 * Set the ui to update the layout (re-render it) on each update, turning this on will break the map ui (if it's being used)
 *
 * @param state int (bool) Set update to 1 or 0 (true/false) (default 0)
 *
 * @return nothing
 */
/datum/nanoui/proc/set_auto_update_layout(nstate)
	auto_update_layout = nstate


/**
 * Set the ui to update the main content (re-render it) on each update
 *
 * @param state int (bool) Set update to 1 or 0 (true/false) (default 1)
 *
 * @return nothing
 */
/datum/nanoui/proc/set_auto_update_content(nstate)
	auto_update_content = nstate


/**
 * Set the state key for use in the frontend Javascript
 *
 * @param nstate_key string The key of the state to use
 *
 * @return nothing
 */
/datum/nanoui/proc/set_state_key(nstate_key)
	state_key = nstate_key


/**
 * Toggle showing the map ui
 *
 * @param nstate_key boolean 1 to show map, 0 to hide (default is 0)
 *
 * @return nothing
 */
/datum/nanoui/proc/set_show_map(nstate)
	show_map = nstate


/**
 * Toggle showing the map ui
 *
 * @param nstate_key boolean 1 to show map, 0 to hide (default is 0)
 *
 * @return nothing
 */
/datum/nanoui/proc/set_map_z_level(nz)
	map_z_level = nz


/**
 * Set whether or not to use the "old" on close logic (mainly unset_machine())
 *
 * @param state int (bool) Set on_close_logic to 1 or 0 (true/false)
 *
 * @return nothing
 */
/datum/nanoui/proc/use_on_close_logic(state)
	on_close_logic = state


/**
 * Add a CSS stylesheet to this UI
 * These must be added before the UI has been opened, adding after that will have no effect
 *
 * @param file string The name of the CSS file from /nano/css (e.g. "my_style.css")
 *
 * @return nothing
 */
/datum/nanoui/proc/add_stylesheet(file)
	stylesheets.Add(file)

/**
 * Add a JavaScript script to this UI
 * These must be added before the UI has been opened, adding after that will have no effect
 *
 * @param file string The name of the JavaScript file from /nano/js (e.g. "my_script.js")
 *
 * @return nothing
 */
/datum/nanoui/proc/add_script(file)
	scripts.Add(file)

/**
 * Add a template for this UI
 * Templates are combined with the data sent to the UI to create the rendered view
 * These must be added before the UI has been opened, adding after that will have no effect
 *
 * @param key string The key which is used to reference this template in the frontend
 * @param filename string The name of the template file from /nano/templates (e.g. "my_template.tmpl")
 *
 * @return nothing
 */
/datum/nanoui/proc/add_template(key, filename)
	templates[key] = filename
