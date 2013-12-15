Holtweeklynews::Application.routes.draw do
  root 'main#index'
  
  get 'issues', to: 'static#issues'
  get 'images/list', to: 'images#list'
  get 'images/:id', to: 'images#show'
  # get 'issues/:id', to: 'issues#show'
  # get 'paper/:id', to: 'paper#show'
  # get 'papers/:id', to: 'papers#show'
end
