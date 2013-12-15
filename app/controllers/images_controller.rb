class ImagesController < ApplicationController
	def search
	end

	def per_page
		10
	end

  def list
		if params[:search_text]
		#@image_pages = Paginator.new self, Image.count, per_page, @params['page']
		#@images = Image.find_by_sql ["SELECT * FROM images WHERE id IN " +
		#	"(SELECT image_id FROM text_indexes WHERE MATCH(full_text) AGAINST (?) " +
		#	"ORDER BY loc " +
		#	"LIMIT #{per_page} OFFSET #{@image_pages.current.to_sql[1]}", @params[:search_text]]
			page = (params[:page] ||= 1).to_i
			items_per_page = 20
			offset = (page - 1) * items_per_page

	#		@images = Image.find_by_sql ["SELECT DISTINCT i.* FROM images i JOIN text_indices t ON i.id = t.image_id " +
	#			"WHERE MATCH(full_text) AGAINST (?)", @params[:search_text]]
			@image_indexes = TextIndex.find_by_contents(params[:search_text], :limit=>:all)
			#@images = @image_indexes.collect { |ii| Image.find ii[:image_id] }
			#@image_pages = Paginator.new(self, @images.length, items_per_page, page)
			@pages = Paginator.new(self, @image_indexes.length, items_per_page, page)
			@total = @image_indexes.length
			@image_indexes = @image_indexes[offset..(offset + items_per_page - 1)]
		else
    	@pages, @image_indexess = paginate :image_index, :per_page => 10
		end
  end

	def index
		if params[:format] == 'xml' and (params[:loc] or params[:id])
			if params[:loc]
				@images = [Image.find_by_loc(params[:loc])]
			else
				@images = [Image.find(params[:id])]
			end
			if @images and @images.first
				render :layout=>false
			else
				render :text=>'Image not found', :status=>404
			end
		else
			redirect_to '/'
		end
	end

  def show
    @image = Image.find(params[:id])
  end

  def new
    @image = Image.new
  end

  def create
    @image = Image.new(params[:image])
    if @image.save
      flash['notice'] = 'Image was successfully created.'
      redirect_to :action => 'list'
    else
      render_action 'new'
    end
  end

  def edit
    @image = Image.find(params[:id])
  end

  def update
    @image = Image.find(params[:id])
    if @image.update_attributes(params[:image])
      flash['notice'] = 'Image was successfully updated.'
      redirect_to :action => 'show', :id => @image
    else
      render_action 'edit'
    end
  end

  def destroy
    Image.find(params[:id]).destroy
    redirect_to :action => 'list'
  end
end
