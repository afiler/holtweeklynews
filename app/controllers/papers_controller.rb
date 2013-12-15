class PapersController < ApplicationController
  def index
    list
    render_action 'list'
  end

  def list
    @paper_pages, @papers = paginate :paper, :per_page => 10
  end

  def show
    @paper = Paper.find(@params[:id])
  end

  def new
    @paper = Paper.new
  end

  def create
    @paper = Paper.new(@params[:paper])
    if @paper.save
      flash['notice'] = 'Paper was successfully created.'
      redirect_to :action => 'list'
    else
      render_action 'new'
    end
  end

  def edit
    @paper = Paper.find(@params[:id])
  end

  def update
    @paper = Paper.find(@params[:id])
    if @paper.update_attributes(@params[:paper])
      flash['notice'] = 'Paper was successfully updated.'
      redirect_to :action => 'show', :id => @paper
    else
      render_action 'edit'
    end
  end

  def destroy
    Paper.find(@params[:id]).destroy
    redirect_to :action => 'list'
  end
end
