//# External nanoui procs and definitions.


/// Used by SSnano {/datum/controller/subsystem/processing/nano} to track UIs opened by this mob
/mob/var/list/open_uis


/**
 * A "panic button" verb to close all UIs on current mob.
 * Use it when the bug with UI not opening (because the server still considers it open despite it being closed on client) pops up.
 * Feel free to remove it once the bug is confirmed to be fixed.
 * ---
 * ### @returns
 * * null
 */
/client/verb/resetnano() as null
	set name = "Reset NanoUI"
	set category = "OOC"

	var/ui_amt = length(mob.open_uis)
	SSnano.close_user_uis(mob)
	to_chat(src, "[ui_amt] UI windows reset.")


/**
 * Called when a Nano UI window is closed
 * This is how Nano handles closed windows
 * It must be a verb so that it can be called using winset
 * ---
 * ### @params
 * * uiref : The reference to the UI window that you want to close.
 * ---
 * ### @returns
 * * null
 */
/client/verb/nanoclose(uiref as text) as null
	set name = "nanoclose"
	set hidden = TRUE

	var/mob/user = src?.mob
	if(!user)
		return

	// TODO: Centralize nanoui windows so we don't have to locate().
	var/datum/nanoui/ui = locate(uiref)

	if(istype(ui))
		ui.close()

		if(ui.ref)
			var/href = "close=1"
			// This will direct to the datum's Topic() proc via client.Topic()
			Topic(href, params2list(href), ui.ref)

		// no atomref specified (or not found)
		// so just reset the user mob's machine var.
		// TODO: Kill the machine var.
		else if(ui.on_close_logic)
			user.unset_machine()
