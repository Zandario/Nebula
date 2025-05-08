// NanoBaseHelpers is where the base template helpers (common to all templates) are stored
NanoBaseHelpers = function () {
	var _baseHelpers = {
			// change ui styling to "syndicate mode"
			syndicateMode: function() {
				// HOLY FUCK THIS DUMB, REPLACE WITH AN ACTUAL STYLESHEET AT SOME POINT
				const syndicateStyles = {
					'body': {
						backgroundColor: '#330404',
						backgroundImage: "url('uiBackground-Syndicate.png')",
						backgroundPosition: '50% 0',
						backgroundRepeat: 'repeat',
						color: '#ff0000'
					},
					'hr': { backgroundColor: '#551414' },
					'a': { background: '#551414' },
					'a:link': { background: '#551414' },
					'a:visited': { background: '#551414' },
					'a:active': { background: '#551414' },
					'linkOn': { background: '#551414' },
					'linkOff': { background: '#551414' },
					'input': { background: '#551414' },
					'a:hover': { color: '#551414' },
					'a.white': { color: '#551414' },
					'a.white:link': { color: '#551414' },
					'a.white:visited': { color: '#551414' },
					'a.white:active': { color: '#551414' },
					'a.white:hover': { background: '#551414' },
					'a.linkOn:link': { background: '#771414' },
					'a.linkOn:visited': { background: '#771414' },
					'a.linkOn:active': { background: '#771414' },
					'a.linkOn:hover': { background: '#771414' },
					'statusDisplay': { border: '1px solid #551414' },
					'block': { border: '1px solid #551414' },
					'progressFill': { background: '#551414' },
					'itemLabelNarrow': { color: '#ff0000' },
					'itemLabel': { color: '#ff0000' },
					'itemLabelWide': { color: '#ff0000' },
					'itemLabelWider': { color: '#ff0000' },
					'itemLabelWidest': { color: '#ff0000' },
					'link': { border: '1px solid #ff0000', background: '#330000' },
					'linkOn': { border: '1px solid #ff0000', background: '#330000' },
					'linkOff': { border: '1px solid #ff0000', background: '#330000' },
					'selected': { border: '1px solid #ff0000', background: '#330000' },
					'disabled': { border: '1px solid #ff0000', background: '#330000' },
					'yellowButton': { border: '1px solid #ff0000', background: '#330000' },
					'redButton': { border: '1px solid #ff0000', background: '#330000' },
					'.average': { color: '#ff0000' },
					'#uiTitleFluff': {
						backgroundImage: "url('uiTitleFluff-Syndicate.png')",
						backgroundPosition: '50% 50%',
						backgroundRepeat: 'no-repeat'
					}
				};

				Object.entries(syndicateStyles).forEach(([selector, styles]) => {
					document.querySelectorAll(selector).forEach(el => {
						Object.assign(el.style, styles);
					});
				});

				return '';
			},
			// Generate a Byond link
			link: function( text, icon, parameters, status, elementClass, elementId) {

				var iconHtml = '';
				var iconClass = 'noIcon';
				if (typeof icon != 'undefined' && icon)
				{
					iconHtml = '<div class="uiLinkPendingIcon"></div><div class="uiIcon16 icon-' + icon + '"></div>';
					iconClass = text ? 'hasIcon' : 'onlyIcon';
				}

				if (typeof elementClass == 'undefined' || !elementClass)
				{
					elementClass = 'link';
				}

				var elementIdHtml = '';
				if (typeof elementId != 'undefined' && elementId)
				{
					elementIdHtml = 'id="' + elementId + '"';
				}

				if (typeof status != 'undefined' && status)
				{
					return '<div unselectable="on" class="link ' + iconClass + ' ' + elementClass + ' ' + status + '" ' + elementIdHtml + '>' + iconHtml + text + '</div>';
				}

				return '<div unselectable="on" class="linkActive ' + iconClass + ' ' + elementClass + '" data-href="' + NanoUtility.generateHref(parameters) + '" ' + elementIdHtml + '>' + iconHtml + text + '</div>';
			},
			// Round a number to the nearest integer
			round: function(number) {
				return Math.round(number);
			},
			// Returns the number fixed to 1 decimal
			fixed: function(number) {
				return Math.round(number * 10) / 10;
			},
			// Round a number down to integer
			floor: function(number) {
				return Math.floor(number);
			},
			// Round a number up to integer
			ceil: function(number) {
				return Math.ceil(number);
			},
			// Format a string (~string("Hello {0}, how are {1}?", 'Martin', 'you') becomes "Hello Martin, how are you?")
			string: function() {
				if (arguments.length == 0)
				{
					return '';
				}
				else if (arguments.length == 1)
				{
					return arguments[0];
				}
				else if (arguments.length > 1)
				{
					stringArgs = [];
					for (var i = 1; i < arguments.length; i++)
					{
						stringArgs.push(arguments[i]);
					}
					return arguments[0].format(stringArgs);
				}
				return '';
			},
			formatNumber: function(x) {
				// From http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
				var parts = x.toString().split(".");
				parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				return parts.join(".");
			},
			// Capitalize the first letter of a string. From http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript
			capitalizeFirstLetter: function(string) {
				return string.charAt(0).toUpperCase() + string.slice(1);
			},
			// Display a bar. Used to show health, capacity, etc. Use difClass if the entire display bar class should be different
			displayBar: function (value, rangeMin, rangeMax, styleClass, showText, difClass, direction, id) {

				if (rangeMin < rangeMax)
				{
					if (value < rangeMin)
					{
						value = rangeMin;
					}
					else if (value > rangeMax)
					{
						value = rangeMax;
					}
				}
				else
				{
					if (value > rangeMin)
					{
						value = rangeMin;
					}
					else if (value < rangeMax)
					{
						value = rangeMax;
					}
				}

				if (typeof styleClass == 'undefined' || !styleClass)
				{
					styleClass = '';
				}

				if (typeof showText == 'undefined' || !showText)
				{
					showText = '';
				}

				if (typeof difClass == 'undefined' || !difClass)
				{
					difClass = ''
				}

				if(typeof direction == 'undefined' || !direction)
				{
					direction = 'width'
				}
				else
				{
					direction = 'height'
				}

				var percentage = Math.round((value - rangeMin) / (rangeMax - rangeMin) * 100);

				return '<div id="displayBar'+id+'" class="displayBar' + difClass + ' ' + styleClass + '"><div id="displayBar'+id+'Fill" class="displayBar' + difClass + 'Fill ' + styleClass + '" style="' + direction + ': ' + percentage + '%;"></div><div id="displayBar'+id+'Text" class="displayBar' + difClass + 'Text ' + styleClass + '">' + showText + '</div></div>';
			},
			// Display DNA Blocks (for the DNA Modifier UI)
			displayDNABlocks: function(dnaString, selectedBlock, selectedSubblock, blockSize, paramKey) {
				if (!dnaString)
				{
					return '<div class="notice">Please place a valid subject into the DNA modifier.</div>';
				}

				var characters = dnaString.split('');

				var html = '<div class="dnaBlock"><div class="link dnaBlockNumber">1</div>';
				var block = 1;
				var subblock = 1;
				for (index in characters)
				{
					if (!characters.hasOwnProperty(index) || typeof characters[index] === 'object')
					{
						continue;
					}

					var parameters;
					if (paramKey.toUpperCase() == 'UI')
					{
						parameters = { 'selectUIBlock' : block, 'selectUISubblock' : subblock };
					}
					else
					{
						parameters = { 'selectSEBlock' : block, 'selectSESubblock' : subblock };
					}

					var status = 'linkActive';
					if (block == selectedBlock && subblock == selectedSubblock)
					{
						status = 'selected';
					}

					html += '<div class="link ' + status + ' dnaSubBlock" data-href="' + NanoUtility.generateHref(parameters) + '" id="dnaBlock' + index + '">' + characters[index] + '</div>'

					index++;
					if (index % blockSize == 0 && index < characters.length)
					{
						block++;
						subblock = 1;
						html += '</div><div class="dnaBlock"><div class="link dnaBlockNumber">' + block + '</div>';
					}
					else
					{
						subblock++;
					}
				}

				html += '</div>';

				return html;
			},
			byondTimeOfDay: function _byondTimeOfDay() {
				if(typeof _byondTimeOfDay.midnight == 'undefined') {
					_byondTimeOfDay.midnight = new Date().setUTCHours(0, 0, 0, 0);
				}
				return (new Date() - _byondTimeOfDay.midnight)/100; // deciseconds since midnight
			}
		};

	return {
		addHelpers: function ()
		{
			NanoTemplate.addHelpers(_baseHelpers);
		},
		removeHelpers: function ()
		{
			for (var helperKey in _baseHelpers)
			{
				if (_baseHelpers.hasOwnProperty(helperKey))
				{
					NanoTemplate.removeHelper(helperKey);
				}
			}
		}
	};
} ();
