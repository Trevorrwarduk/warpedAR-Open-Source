/*
 * titleBar
 * ========
 *
 * This module builds the title bar for displaying anywhere.
 *
 * This is a stand-alone module.
 */

function titleBarView()
{
    /*
     * Load the required modules for this function
     */
    var layout    =    require('/ui/layout');
    var images    =    require('/ui/images');

    var tbView    =    Ti.UI.createView({
        top :    0,
        left :    0,
        right :    0,
        height :    layout.css.tb.hi,
        backgroundColor :    layout.css.sbkc.tb
    });
    var tbLabel    =    Ti.UI.createLabel({
        top :    0,
        bottom :    4,
        left :    0,
        right :    0,
        text :    Ti.Locale.getString('app_name'),
        textAlign :    layout.css.tb.ta,
        color :    layout.css.tb.fnc,
        font : {
            fontFamily :    layout.css.tb.fnf,
            fontWeight :    layout.css.tb.fnw,
            fontSize :    layout.css.tb.fns
        }
    });
    var tbLogo    =    Ti.UI.createImageView({
        right :    '10dp',
        bottom :    '14dp',
        height :    'auto',
        width :    'auto',
        image :    images.file.icon
    });
    var tbLine    =    Ti.UI.createView({
        left :    6,
        bottom :    0,
        height :    2,
        right :    6,
        backgroundColor :    layout.css.tb.line
    });
    /*
     * Add the view components
     */
    tbView.add(tbLabel);
    tbView.add(tbLogo);
    tbView.add(tbLine);

    /*
     * Return the main view
     */
    return tbView;
}

/*
 * Export the required functions for access
 */
exports.titleBarView    =    titleBarView;
