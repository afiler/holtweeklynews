class StaticController < ApplicationController
  #layout 'static'

  caches_page :issues

  def issues
		render 'static/issues'
  end
end

