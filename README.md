Testimonials
============
Module with backend and frontend intergarion

![Testimonials](https://github.com/axis/testimonials/raw/master/media/example/testimonials.gif "Testimonials")

Backend integration

![Backend functionality](https://github.com/axis/testimonials/raw/master/media/example/testimonials_backend.gif "Backend functionality")

Module provides a box that can be configured and assigned to any page.

Box Configuration

![Box configuration](https://github.com/axis/testimonials/raw/master/media/example/testimonials_box_configuration.gif "Box configuration")

Setting up the box and testimonials page:

 * Navigate to admin/core/theme
 * Select your active theme (custom by default)
 * Add new box with following parameters:
  * Box: Example_Testimonials_Testimonials
  * Output Container: content
  * Show on: testimonials/index/index
 * Save the box
 * Switch to the layout tab on the same page
 * Add new layout with following parameters:
  * layout: 1column
  * Page: testimonials/*/*
  * Parent Page: none
 * Save the layout
 * Now you can switch to the frontend and see the example.com/testimonials page

If you want to output some testimonial on the home or any other page in the side column:

 * Navigate to admin/core/theme
 * Select your active theme (custom by default)
 * Add new box with following parameters:
  * Box: Example_Testimonials_Testimonials
  * Output Container: right
  * Show on: core/index/index
  * Sort Order: 1
 * Save the box
 * Now open the box edit window by double clicking the saved box
 * Switch to configuration tab and set the following parameters:
  * Testimonials Count: 1
  * Testimonial Id: The id of testimonial you want to show. Can be empty to show the latest testimonial
  * Url: testimonials
  * Disable Wrapper: No
 * Save the changes
 * Now open the homepage of your store and see the result
