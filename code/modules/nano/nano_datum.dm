/*#
 * External nanoui procs and definitions.
 */


/**
 * The ui_interact proc is used to open and update Nano UIs.
 * If ui_interact is not used then the UI will not update correctly.
 * ui_interact is currently defined for {/atom/movable}.
 * ---
 * ### @params
 * * user       : The mob who interacting with the UI.
 * * ui_key     : A string key to use for this UI. Allows for multiple unique UIs on one obj/mob (defaut value "main").
 * * ui         : This parameter is passed by the nanoui process() proc when updating an open UI.
 * * force_open : Force the UI to (re)open, even if it's already open.
 * ---
 * ### @returns
 * * null
 */
/datum/proc/ui_interact(mob/user, ui_key = "main", datum/nanoui/ui, force_open = TRUE, datum/nanoui/master_ui, datum/topic_state/state = global.default_topic_state)
	return


/**
 * Data to be sent to the UI.
 * This must be implemented for a UI to work.
 * ---
 * ### @params
 * * user   : The mob who interacting with the UI.
 * * ui_key : A string key to use for this UI. Allows for multiple unique UIs on one obj/mob (defaut value "main").
 * ---
 * ### @returns
 * * data : Data to be sent to the UI.
 */
/datum/proc/ui_data(mob/user, ui_key = "main") as /list
	return list() // Not implemented.
