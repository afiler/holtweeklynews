class IssuesController < ApplicationController
  def index
    list
    render_action 'list'
  end

  def list
    @issue_pages, @issues = paginate :issue, :per_page => 10
  end

  def show
    @issue = Issue.find(@params[:id])
  end

  def new
    @issue = Issue.new
  end

  def create
    @issue = Issue.new(@params[:issue])
    if @issue.save
      flash['notice'] = 'Issue was successfully created.'
      redirect_to :action => 'list'
    else
      render_action 'new'
    end
  end

  def edit
    @issue = Issue.find(@params[:id])
  end

  def update
    @issue = Issue.find(@params[:id])
    if @issue.update_attributes(@params[:issue])
      flash['notice'] = 'Issue was successfully updated.'
      redirect_to :action => 'show', :id => @issue
    else
      render_action 'edit'
    end
  end

  def destroy
    Issue.find(@params[:id]).destroy
    redirect_to :action => 'list'
  end
end
